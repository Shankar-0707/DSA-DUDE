import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { Clock, ChevronLeft, ChevronRight, Check, Save, ArrowLeft, AlertCircle, Trophy } from "lucide-react";
import Navbar from "@/components/Navbar";
import API from "@/api/api";



export default function QuizPlay() {
    const { topic, level } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const autostart = searchParams.get('autostart') === 'true';
    const questionCount = parseInt(searchParams.get('count')) || 10;

    // Generate a unique storage key for this specific quiz session
    const storageKey = `quiz_${topic}_${level}`;

    const [questions, setQuestions] = useState(() => {
        const saved = localStorage.getItem(`${storageKey}_questions`);
        return saved ? JSON.parse(saved) : [];
    });
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState(() => {
        const saved = localStorage.getItem(`${storageKey}_current`);
        return saved ? parseInt(saved) : 0;
    });
    const [answers, setAnswers] = useState(() => {
        const saved = localStorage.getItem(`${storageKey}_answers`);
        return saved ? JSON.parse(saved) : {};
    });
    const [time, setTime] = useState(() => {
        const saved = localStorage.getItem(`${storageKey}_time`);
        return saved ? parseInt(saved) : 0;
    });
    const [isPaused, setIsPaused] = useState(false);
    const [showSaved, setShowSaved] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasStarted, setHasStarted] = useState(() => {
        const saved = localStorage.getItem(`${storageKey}_started`);
        return saved === "true" || autostart;
    });

    // Temp state for the current question selection (unsaved)
    const [tempSelection, setTempSelection] = useState(null);

    // Sync tempSelection with already saved answer whenever current question changes
    useEffect(() => {
        setTempSelection(answers[current] || null);
    }, [current, answers]);

    // Save progress to localStorage whenever it changes
    useEffect(() => {
        if (questions.length > 0) {
            localStorage.setItem(`${storageKey}_questions`, JSON.stringify(questions));
        }
        localStorage.setItem(`${storageKey}_answers`, JSON.stringify(answers));
        localStorage.setItem(`${storageKey}_current`, current.toString());
        localStorage.setItem(`${storageKey}_time`, time.toString());
        localStorage.setItem(`${storageKey}_started`, hasStarted.toString());
    }, [questions, answers, current, time, storageKey, hasStarted]);

    // Stopwatch - ONLY starts when hasStarted is true AND questions are loaded
    useEffect(() => {
        let timer;
        if (hasStarted && questions.length > 0 && !isPaused && !showSubmitModal) {
            timer = setInterval(() => {
                setTime((t) => t + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isPaused, showSubmitModal, hasStarted, questions.length]);

    const handleSave = () => {
        if (tempSelection) {
            setAnswers((prev) => ({ ...prev, [current]: tempSelection }));
            setShowSaved(true);
            setTimeout(() => setShowSaved(false), 2000);
        }
    };

    useEffect(() => {
        async function fetchQuiz() {
            // Only fetch if hasStarted is true AND we don't already have questions saved
            if (!hasStarted || questions.length > 0) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const res = await API.get(
                    `/quiz/generate?topic=${topic}&level=${level}&count=${questionCount}`
                );

                if (res.data && res.data.questions) {
                    setQuestions(res.data.questions);
                } else if (Array.isArray(res.data)) {
                    setQuestions(res.data);
                } else {
                    throw new Error('Invalid quiz data format received');
                }
            } catch (error) {
                console.error("Failed to fetch quiz:", error);
                // Show error state or fallback
                setQuestions([{
                    question: "Unable to load quiz questions. Please try again later.",
                    options: ["Retry", "Go Back", "Contact Support", "Try Different Topic"],
                    correctAnswer: "Retry",
                    explanation: "There was an issue generating your quiz. Please check your connection and try again."
                }]);
            } finally {
                setLoading(false);
            }
        }

        fetchQuiz();
    }, [topic, level, questions.length, hasStarted, questionCount]);

    // Derived values based on dynamic questions
    const activeQuestions = Array.isArray(questions) ? questions : [];
    const currentQuestion = activeQuestions[current] || { question: "", options: [] };
    const progress = activeQuestions.length > 0 ? ((current + 1) / activeQuestions.length) * 100 : 0;
    const answeredCount = Object.keys(answers).length;
    const formattedTopic = topic?.replace(/-/g, " ") || "";

    function calculateResult(questions, answers) {
        let score = 0;

        const detailed = questions.map((q, idx) => {
            const userAnswer = answers[idx] || null;
            const isCorrect = userAnswer === q.correctAnswer;

            if (isCorrect) score++;

            return {
                question: q.question,
                options: q.options,
                userAnswer,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
                isCorrect,
            };
        });

        return { score, detailed };
    }


    const handleFinalSubmit = useCallback(() => {
        if (isSubmitting) return; // Prevent double submission
        
        setIsSubmitting(true);
        
        try {
            const result = calculateResult(activeQuestions, answers);

            // store result for result page
            localStorage.setItem(
                `${storageKey}_result`,
                JSON.stringify({ ...result, timeTaken: time })
            );

            // cleanup quiz progress
            localStorage.removeItem(`${storageKey}_questions`);
            localStorage.removeItem(`${storageKey}_answers`);
            localStorage.removeItem(`${storageKey}_current`);
            localStorage.removeItem(`${storageKey}_time`);
            localStorage.removeItem(`${storageKey}_started`);

            navigate(`/quiz/${topic}/${level}/result`);
        } catch (error) {
            console.error('Error submitting quiz:', error);
            setIsSubmitting(false);
        }
    }, [activeQuestions, answers, time, storageKey, navigate, topic, level, isSubmitting]);

    return (
        <div className="fixed inset-0 bg-background text-foreground overflow-hidden flex flex-col">
            <Navbar />

            {/* Entry Screen (Before Start) */}
            {!hasStarted && !autostart && (
                <div className="fixed inset-0 z-[300] bg-background flex items-center justify-center p-6 bg-gradient-to-br from-blue-500/5 via-background to-purple-500/5">
                    <div className="max-w-xl w-full text-center space-y-8 animate-fade-in-up">
                        <div className="relative inline-block">
                            <div className="w-24 h-24 rounded-[2rem] bg-blue-600/10 border-2 border-blue-500/20 flex items-center justify-center mx-auto shadow-2xl">
                                <Trophy className="w-12 h-12 text-blue-600 dark:text-orange-500 animate-pulse" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center border-4 border-background animate-bounce">
                                <Check className="w-4 h-4 text-white" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
                                Ready to <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-orange-500 dark:to-orange-600 bg-clip-text text-transparent">Begin?</span>
                            </h2>
                            <p className="text-muted-foreground text-lg font-medium max-w-md mx-auto">
                                You're about to start a <span className="text-foreground font-bold">{questionCount}-question</span> assessment on <span className="text-foreground font-bold">{formattedTopic}</span> at <span className="text-foreground font-bold">{level}</span> difficulty.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-card/30 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-xl">
                            <div className="text-center space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Questions</p>
                                <p className="text-2xl font-bold text-blue-600 dark:text-orange-500">{questionCount}</p>
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Time Limit</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">None</p>
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Difficulty</p>
                                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{level}</p>
                            </div>
                        </div>

                        <div className="bg-blue-500/10 dark:bg-orange-500/10 border border-blue-500/20 dark:border-orange-500/20 rounded-2xl p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-500 dark:text-orange-500 mt-0.5 flex-shrink-0" />
                                <div className="space-y-2 text-sm">
                                    <p className="font-semibold text-blue-700 dark:text-orange-400">Quiz Instructions:</p>
                                    <ul className="space-y-1 text-blue-600 dark:text-orange-300">
                                        <li>• Each question has 4 options, only one is correct</li>
                                        <li>• You can navigate between questions freely</li>
                                        <li>• Save your answers before moving to the next question</li>
                                        <li>• Review all answers before final submission</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                            <button
                                onClick={() => navigate(`/quiz/${topic}?count=${questionCount}`)}
                                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-muted/50 border border-border/50 font-black uppercase tracking-widest text-xs hover:bg-muted transition-all"
                            >
                                Not Now
                            </button>
                            <button
                                onClick={() => setHasStarted(true)}
                                className="w-full sm:w-auto px-12 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 dark:from-orange-500 dark:to-orange-600 text-white font-black uppercase tracking-widest text-xs hover:scale-105 hover:shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-3"
                            >
                                Begin Assessment
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 z-[200] bg-background/80 backdrop-blur-xl flex flex-col items-center justify-center animate-fade-in">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-3xl border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-blue-500 animate-pulse" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 text-center space-y-2">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-orange-500 dark:to-orange-600 bg-clip-text text-transparent animate-pulse">
                            Crafting Your Quiz...
                        </h2>
                        <p className="text-muted-foreground text-sm font-medium">Our AI is generating {questionCount} custom questions for {formattedTopic}</p>
                    </div>
                </div>
            )}

            {/* Gradient Background Overlay */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-orange-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-500/5 dark:bg-orange-600/5 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            {/* Enhanced Top Navigation */}
            <div className="relative z-10 bg-card/30 backdrop-blur-xl border-b border-border/30 px-4 sm:px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Left: Back Button & Quiz Info */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(`/quiz/${topic}?count=${questionCount}`)}
                            className="p-2.5 rounded-xl bg-muted/50 hover:bg-muted border border-border/50 hover:border-blue-500/50 dark:hover:border-orange-500/50 transition-all duration-300 hover:scale-110 group shadow-sm"
                            title="Back to difficulty selection"
                        >
                            <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </button>

                        <div className="hidden sm:block">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-orange-500/20 dark:to-orange-600/20 border border-blue-500/30 dark:border-orange-500/30 flex items-center justify-center">
                                    <span className="text-sm font-bold text-blue-600 dark:text-orange-500">
                                        {formattedTopic.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold capitalize leading-none">
                                        <span className="bg-gradient-to-r from-foreground via-blue-600 dark:via-orange-500 to-foreground bg-clip-text text-transparent">
                                            {formattedTopic}
                                        </span>
                                    </h1>
                                    <p className="text-xs text-muted-foreground font-medium">
                                        {level} • {questionCount} Questions
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Center: Progress Bar */}
                    <div className="flex-1 max-w-md mx-4 sm:mx-8">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-medium">
                                <span className="text-blue-600 dark:text-orange-500">Progress</span>
                                <span className="text-muted-foreground">
                                    {activeQuestions.length > 0 ? `${current + 1} / ${activeQuestions.length}` : "Loading..."}
                                </span>
                            </div>
                            <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-orange-500 dark:to-orange-600 transition-all duration-500 rounded-full"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{Math.round(progress)}% complete</span>
                                <span>{answeredCount} answered</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Timer & Controls */}
                    <div className="flex items-center gap-3">
                        {/* Pause Button */}
                        <button
                            onClick={() => setIsPaused(!isPaused)}
                            className={`p-2.5 rounded-xl border backdrop-blur-xl transition-all duration-300 hover:scale-110 shadow-sm flex items-center gap-2 group ${
                                isPaused
                                    ? "bg-blue-500/20 border-blue-500/50 text-blue-600 dark:text-blue-400"
                                    : "bg-muted/50 border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                            title={isPaused ? "Resume Quiz" : "Pause Quiz"}
                        >
                            {isPaused ? (
                                <ChevronRight className="w-5 h-5 animate-pulse" />
                            ) : (
                                <div className="flex gap-0.5 group-hover:scale-110 transition-transform">
                                    <div className="w-1 h-4 bg-current rounded-full" />
                                    <div className="w-1 h-4 bg-current rounded-full" />
                                </div>
                            )}
                        </button>

                        {/* Timer */}
                        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl px-4 py-2.5 shadow-sm">
                            <div className="flex items-center gap-2">
                                <Clock className={`w-4 h-4 text-blue-600 dark:text-orange-500 ${!isPaused && "animate-pulse"}`} />
                                <span className="font-mono text-sm font-bold tracking-tight">
                                    {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Main Quiz Area */}
            <div className="flex-1 flex flex-col px-4 sm:px-6 py-4 overflow-y-auto relative">
                {/* Pause Overlay */}
                {isPaused && (
                    <div className="absolute inset-0 z-20 bg-background/40 backdrop-blur-sm flex items-center justify-center animate-fade-in">
                        <div className="bg-card/90 border border-border/50 rounded-3xl p-8 shadow-2xl text-center space-y-4 animate-scale-in">
                            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border-2 border-blue-500/50 flex items-center justify-center mx-auto">
                                <div className="flex gap-2">
                                    <div className="w-2 h-6 bg-blue-500 rounded-full animate-bounce" />
                                    <div className="w-2 h-6 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold uppercase tracking-tighter">Quiz Paused</h2>
                            <p className="text-muted-foreground text-sm">Take a breather, then dive back in!</p>
                            <button
                                onClick={() => setIsPaused(false)}
                                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 dark:from-orange-500 dark:to-orange-600 text-white font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-lg"
                            >
                                Resume Quiz
                            </button>
                        </div>
                    </div>
                )}

                {/* Question Container */}
                <div className="max-w-4xl mx-auto w-full animate-fade-in-up">
                    <div className="relative bg-card/40 backdrop-blur-xl border border-border/30 rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden">
                        {/* Background Elements */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/5 dark:bg-orange-500/5 rounded-full blur-[80px]" />
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/5 dark:bg-orange-600/5 rounded-full blur-[80px]" />

                        <div className="relative z-10 w-full space-y-6">
                            {/* Question Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-orange-500/20 dark:to-orange-600/20 border border-blue-500/30 dark:border-orange-500/30 flex items-center justify-center">
                                        <span className="text-lg font-bold text-blue-600 dark:text-orange-500">
                                            {current + 1}
                                        </span>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-foreground">
                                            Question {current + 1}
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            of {activeQuestions.length} questions
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <span className="text-green-600 dark:text-green-400 font-medium">
                                            {answeredCount} answered
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                                        <span className="text-orange-600 dark:text-orange-400 font-medium">
                                            {activeQuestions.length - answeredCount} remaining
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Question Text */}
                            <div className="space-y-6">
                                <div className="prose prose-lg max-w-none">
                                    <h3 className="text-xl sm:text-2xl font-semibold text-foreground leading-relaxed whitespace-pre-line break-words m-0">
                                        {currentQuestion.question}
                                    </h3>
                                </div>

                                {/* Answer Options */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 dark:from-orange-500 dark:to-orange-600 rounded-full" />
                                        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                            Select the correct answer
                                        </p>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-3">
                                        {currentQuestion.options.map((opt, idx) => {
                                            const isSelected = tempSelection === opt;
                                            const isSaved = answers[current] === opt;
                                            const optionLabel = String.fromCharCode(65 + idx);
                                            
                                            return (
                                                <label
                                                    key={`${current}-${idx}`}
                                                    className={`group relative block p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                                                        isSelected
                                                            ? "border-blue-500 dark:border-orange-500 bg-blue-500/10 dark:bg-orange-500/10 shadow-lg scale-[1.01] ring-2 ring-blue-500/20 dark:ring-orange-500/20"
                                                            : "border-border/40 bg-card/20 hover:border-blue-400/50 dark:hover:border-orange-400/50 hover:bg-card/40 hover:scale-[1.005]"
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        {/* Option Letter */}
                                                        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                                                            isSelected
                                                                ? "bg-gradient-to-br from-blue-500 to-blue-600 dark:from-orange-500 dark:to-orange-600 text-white shadow-md"
                                                                : "bg-muted/60 text-muted-foreground group-hover:bg-muted group-hover:text-foreground"
                                                        }`}>
                                                            {optionLabel}
                                                        </div>

                                                        <input
                                                            type="radio"
                                                            name={`q-${current}`}
                                                            className="hidden"
                                                            checked={isSelected}
                                                            onChange={() => setTempSelection(opt)}
                                                        />

                                                        {/* Option Text */}
                                                        <div className="flex-1 min-w-0 py-1">
                                                            <span className={`block text-base font-medium transition-colors duration-300 whitespace-pre-line break-words leading-relaxed ${
                                                                isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                                                            }`}>
                                                                {opt}
                                                            </span>
                                                        </div>

                                                        {/* Status Indicator */}
                                                        <div className="flex-shrink-0 flex items-center gap-2">
                                                            {isSaved && (
                                                                <div className="w-8 h-8 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center animate-fade-in" title="Answer Saved">
                                                                    <Check className="w-4 h-4 text-green-500" />
                                                                </div>
                                                            )}
                                                            {!isSaved && isSelected && (
                                                                <div className="px-2 py-1 rounded-full bg-blue-500/10 dark:bg-orange-500/10 border border-blue-500/30 dark:border-orange-500/30">
                                                                    <span className="text-xs font-bold uppercase text-blue-600 dark:text-orange-500 animate-pulse">
                                                                        Not Saved
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Bottom Navigation */}
            <div className="relative z-10 bg-card/40 backdrop-blur-xl border-t border-border/30 p-4 sm:p-6">
                <div className="max-w-6xl mx-auto space-y-4">
                    {/* Question Navigator */}
                    <div className="flex items-center justify-center">
                        <div className="flex items-center gap-2 bg-muted/20 rounded-2xl p-3 max-w-full overflow-x-auto" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                            <div className="flex items-center gap-2">
                                {activeQuestions.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrent(idx)}
                                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-110 flex-shrink-0 relative ${
                                            idx === current
                                                ? "bg-gradient-to-br from-blue-500 to-blue-600 dark:from-orange-500 dark:to-orange-600 text-white shadow-lg ring-2 ring-blue-500/30 dark:ring-orange-500/30"
                                                : answers[idx]
                                                    ? "bg-green-500/20 border-2 border-green-500/50 text-green-600 dark:text-green-400 shadow-inner"
                                                    : "bg-muted/50 border border-border/50 text-muted-foreground hover:bg-muted/70 hover:border-blue-400/50 dark:hover:border-orange-400/50"
                                        }`}
                                        title={`Question ${idx + 1}${answers[idx] ? ' (Answered)' : ' (Not Answered)'}`}
                                    >
                                        {idx + 1}
                                        {answers[idx] && idx !== current && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                                <Check className="w-2.5 h-2.5 text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                        {/* Left: Previous Button */}
                        <button
                            disabled={current === 0}
                            onClick={() => setCurrent((c) => c - 1)}
                            className="flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl bg-muted/50 hover:bg-muted border border-border/50 text-foreground font-semibold transition-all duration-300 hover:scale-105 shadow-sm disabled:opacity-30 disabled:pointer-events-none group"
                        >
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="hidden sm:inline">Previous</span>
                        </button>

                        {/* Center: Save Answer Button */}
                        <div className="flex items-center gap-4">
                            {showSaved && (
                                <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/50 text-green-600 dark:text-green-400 text-sm font-bold animate-fade-in-up flex items-center gap-2">
                                    <Check className="w-4 h-4" />
                                    <span className="hidden sm:inline">Answer Saved!</span>
                                    <span className="sm:hidden">Saved!</span>
                                </div>
                            )}
                            
                            <button
                                onClick={handleSave}
                                disabled={!tempSelection || tempSelection === answers[current]}
                                className="px-6 sm:px-8 py-3 rounded-xl bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/50 text-yellow-600 dark:text-yellow-500 font-bold uppercase tracking-wider text-sm transition-all duration-300 hover:scale-105 shadow-sm flex items-center gap-2 group disabled:opacity-30 disabled:pointer-events-none"
                            >
                                <Save className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                <span className="hidden sm:inline">Save Answer</span>
                                <span className="sm:hidden">Save</span>
                            </button>
                        </div>

                        {/* Right: Next/Submit Button */}
                        {current < activeQuestions.length - 1 ? (
                            <button
                                onClick={() => setCurrent((c) => c + 1)}
                                className="flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 dark:from-orange-500 dark:to-orange-600 border border-blue-400/50 dark:border-orange-400/50 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                            >
                                <span className="hidden sm:inline">Next</span>
                                <span className="sm:hidden">Next</span>
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowSubmitModal(true)}
                                className="flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 border border-green-400/50 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                            >
                                <span className="hidden sm:inline">Submit Quiz</span>
                                <span className="sm:hidden">Submit</span>
                                <Check className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                            </button>
                        )}
                    </div>

                    {/* Progress Summary */}
                    <div className="text-center">
                        <div className="inline-flex items-center gap-4 px-4 py-2 rounded-xl bg-muted/20 border border-border/30">
                            <div className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="text-muted-foreground">
                                    <span className="font-semibold text-foreground">{answeredCount}</span> answered
                                </span>
                            </div>
                            <div className="w-px h-4 bg-border/50" />
                            <div className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 rounded-full bg-orange-500" />
                                <span className="text-muted-foreground">
                                    <span className="font-semibold text-foreground">{activeQuestions.length - answeredCount}</span> remaining
                                </span>
                            </div>
                            <div className="w-px h-4 bg-border/50" />
                            <div className="text-sm text-muted-foreground">
                                <span className="font-semibold text-blue-600 dark:text-orange-500">
                                    {Math.round((answeredCount / activeQuestions.length) * 100)}%
                                </span> complete
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Confirmation Modal */}
            {showSubmitModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-md" 
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!isSubmitting) {
                                setShowSubmitModal(false);
                            }
                        }} 
                    />
                    <div 
                        className="relative w-full max-w-md bg-card/90 backdrop-blur-3xl border border-border/50 rounded-[2rem] p-8 shadow-2xl animate-fade-in-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-20 h-20 rounded-3xl bg-green-500/10 border-2 border-green-500/50 flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-10 h-10 text-green-500" />
                        </div>
                        
                        <h2 className="text-2xl font-bold text-center mb-4">Submit Quiz?</h2>
                        
                        <div className="space-y-4 mb-8">
                            <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Total Questions:</span>
                                    <span className="font-bold">{activeQuestions.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Answered:</span>
                                    <span className="font-bold text-green-600">{answeredCount}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Unanswered:</span>
                                    <span className="font-bold text-orange-600">{activeQuestions.length - answeredCount}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-border/30">
                                    <span className="text-sm text-muted-foreground">Completion:</span>
                                    <span className="font-bold">{Math.round((answeredCount / activeQuestions.length) * 100)}%</span>
                                </div>
                            </div>
                            
                            {answeredCount < activeQuestions.length && (
                                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3">
                                    <p className="text-sm text-orange-600 dark:text-orange-400 text-center">
                                        ⚠️ You have {activeQuestions.length - answeredCount} unanswered questions. They will be marked as incorrect.
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setShowSubmitModal(false)}
                                disabled={isSubmitting}
                                className="px-6 py-3 rounded-xl bg-muted/50 hover:bg-muted border border-border/50 font-bold transition-all disabled:opacity-50"
                            >
                                Review Answers
                            </button>
                            <button
                                onClick={handleFinalSubmit}
                                disabled={isSubmitting}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        Submit Quiz
                                        <Check className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
