import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Clock, ChevronLeft, ChevronRight, Check, Save, ArrowLeft, AlertCircle, Trophy } from "lucide-react";
import Navbar from "@/components/Navbar";
import API from "@/api/api";



export default function QuizPlay() {
    const { topic, level } = useParams();
    const navigate = useNavigate();

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
    const [hasStarted, setHasStarted] = useState(() => {
        const saved = localStorage.getItem(`${storageKey}_started`);
        return saved === "true";
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
                    `/quiz/generate?topic=${topic}&level=${level}&count=10`
                );

                if (res.data && res.data.questions) {
                    setQuestions(res.data.questions);
                } else if (Array.isArray(res.data)) {
                    setQuestions(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch quiz:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchQuiz();
    }, [topic, level, questions.length, hasStarted]);

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


    const handleFinalSubmit = () => {
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
    };

    return (
        <div className="fixed inset-0 bg-background text-foreground overflow-hidden flex flex-col">
            <Navbar />

            {/* Entry Screen (Before Start) */}
            {!hasStarted && (
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
                                Ready to <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-orange-500 dark:to-orange-600 bg-clip-text text-transparent">Dominate?</span>
                            </h2>
                            <p className="text-muted-foreground text-lg font-medium max-w-md mx-auto">
                                You are about to start the <span className="text-foreground font-bold">{formattedTopic}</span> assessment at <span className="text-foreground font-bold">{level}</span> difficulty.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 bg-card/30 backdrop-blur-xl border border-border/50 rounded-3xl p-6 text-left shadow-xl">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Questions</p>
                                <p className="text-xl font-bold">10 Dynamic</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Type</p>
                                <p className="text-xl font-bold">AI Calibrated</p>
                            </div>
                            <div className="space-y-1 border-t border-border/50 pt-4 mt-2 col-span-2">
                                <p className="text-xs font-bold text-muted-foreground italic flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-blue-500" />
                                    Your timer starts only when questions load!
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                            <button
                                onClick={() => navigate(`/quiz/${topic}`)}
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
                        <p className="text-muted-foreground text-sm font-medium">Our AI is generating custom questions for {formattedTopic}</p>
                    </div>
                </div>
            )}

            {/* Gradient Background Overlay */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-orange-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-500/5 dark:bg-orange-600/5 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            {/* Immersive Top Bar */}
            <div className="relative z-10 px-6 py-4 flex items-center justify-between pointer-events-none">
                {/* Left Side: Back & Info */}
                <div className="flex items-center gap-4 pointer-events-auto">
                    <button
                        onClick={() => navigate(`/quiz/${topic}`)}
                        className="p-3 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 hover:border-blue-500/50 dark:hover:border-orange-500/50 transition-all duration-300 hover:scale-110 group shadow-lg"
                    >
                        <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </button>

                    <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl px-5 py-3 shadow-lg">
                        <h1 className="text-xl font-bold capitalize leading-none mb-1">
                            <span className="bg-gradient-to-r from-foreground via-blue-600 dark:via-orange-500 to-foreground bg-clip-text text-transparent">
                                {formattedTopic}
                            </span>
                        </h1>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black opacity-60">{level} Difficulty</p>
                    </div>
                </div>

                {/* Center: Progress (Floating) */}
                <div className="absolute left-1/2 -translate-x-1/2 top-4 w-full max-w-md px-6 hidden md:block">
                    <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-4 shadow-lg">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter mb-2">
                            <span className="text-blue-500 dark:text-orange-500">Progress</span>
                            <span className="text-muted-foreground">
                                {activeQuestions.length > 0 ? `${current + 1} / ${activeQuestions.length}` : "Preparing..."}
                            </span>
                        </div>
                        <div className="h-1.5 w-full bg-muted/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-orange-500 dark:to-orange-600 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Side: Timer & Pause */}
                <div className="flex items-center gap-3 pointer-events-auto animate-fade-in">
                    {/* Pause Button */}
                    <button
                        onClick={() => setIsPaused(!isPaused)}
                        className={`p-2 rounded-xl border backdrop-blur-xl transition-all duration-300 hover:scale-110 shadow-lg flex items-center gap-2 group ${isPaused
                            ? "bg-blue-500/20 border-blue-500/50 text-blue-600 dark:text-blue-400"
                            : "bg-card/50 border-border/50 text-muted-foreground hover:text-foreground"
                            }`}
                        title={isPaused ? "Resume Quiz" : "Pause Quiz"}
                    >
                        {isPaused ? (
                            <ChevronRight className="w-5 h-5 animate-pulse" />
                        ) : (
                            <div className="flex gap-1 group-hover:scale-110 transition-transform">
                                <div className="w-1.5 h-4 bg-muted-foreground group-hover:bg-foreground rounded-full" />
                                <div className="w-1.5 h-4 bg-muted-foreground group-hover:bg-foreground rounded-full" />
                            </div>
                        )}
                        {/* <span className="text-xs font-bold uppercase tracking-widest hidden sm:block">
                            {isPaused ? "Resume" : "Pause"}
                        </span> */}
                    </button>

                    <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl px-5 py-3 shadow-lg flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-orange-500/10 flex items-center justify-center">
                            <Clock className={`w-4 h-4 text-blue-600 dark:text-orange-500 ${!isPaused && "animate-pulse"}`} />
                        </div>
                        <span className="font-mono text-xl font-bold tracking-tight">
                            {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Quiz Area (Left Aligned & Full Width) */}
            <div className="flex-1 flex flex-col items-start px-6 py-4 overflow-y-auto relative">
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

                <div className="w-full animate-fade-in-up">
                    <div className="relative bg-card/30 backdrop-blur-3xl border border-border/50 rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden">
                        {/* Background Glows inside card */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/5 dark:bg-orange-500/5 rounded-full blur-[80px]" />
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-500/5 dark:bg-orange-600/5 rounded-full blur-[80px]" />

                        <div className="relative z-10 w-full">
                            <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-orange-500 mb-3 bg-blue-500/10 dark:bg-orange-500/10 px-3 py-1 rounded-full">Question {current + 1} / {activeQuestions.length}</span>

                            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-6 max-w-5xl whitespace-pre-wrap font-mono leading-relaxed">
                                {currentQuestion.question}
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                                {currentQuestion.options.map((opt, idx) => {
                                    const isSelected = tempSelection === opt;
                                    const isSaved = answers[current] === opt;
                                    return (
                                        <label
                                            key={opt}
                                            className={`group relative block p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${isSelected
                                                ? "border-blue-500 dark:border-orange-500 bg-blue-500/10 dark:bg-orange-500/10 shadow-lg"
                                                : "border-border/30 bg-white/5 dark:bg-black/20 hover:border-blue-400/50 dark:hover:border-orange-400/50 hover:bg-white/10 dark:hover:bg-black/30"
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs transition-all duration-300 ${isSelected
                                                    ? "bg-gradient-to-br from-blue-500 to-blue-600 dark:from-orange-500 dark:to-orange-600 text-white shadow-md"
                                                    : "bg-muted/50 text-muted-foreground group-hover:bg-muted"
                                                    }`}>
                                                    {String.fromCharCode(65 + idx)}
                                                </div>

                                                <input
                                                    type="radio"
                                                    name={`q-${current}`}
                                                    className="hidden"
                                                    checked={isSelected}
                                                    onChange={() => setTempSelection(opt)}
                                                />

                                                <span className={`flex-1 text-base font-semibold transition-colors duration-300 ${isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                                                    }`}>
                                                    {opt}
                                                </span>

                                                {isSaved && (
                                                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center animate-fade-in" title="Answer Saved">
                                                        <Check className="w-3 h-3 text-green-500" />
                                                    </div>
                                                )}
                                                {!isSaved && isSelected && (
                                                    <div className="text-[8px] font-black uppercase text-blue-500 animate-pulse">Unsaved</div>
                                                )}
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Immersive Bottom Navigation */}
            <div className="relative z-10 p-6 flex items-center justify-between">
                {/* Left Side: Question Navigator (Hidden on tiny screens) */}
                <div className="hidden sm:flex items-center gap-2 bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-2 shadow-lg">
                    {activeQuestions.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`w-10 h-10 rounded-xl font-bold text-xs transition-all duration-300 hover:scale-110 ${idx === current
                                ? "bg-gradient-to-br from-blue-500 to-blue-600 dark:from-orange-500 dark:to-orange-600 text-white shadow-lg"
                                : answers[idx]
                                    ? "bg-green-500/20 border-2 border-green-500/50 text-green-600 dark:text-green-400 shadow-inner"
                                    : "bg-muted/30 border border-border/50 text-muted-foreground hover:bg-muted/50"
                                }`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>

                {/* Right Side: Primary Controls */}
                <div className="flex items-center gap-3 ml-auto">
                    {/* Saved Notification */}
                    {showSaved && (
                        <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/50 text-green-600 dark:text-green-400 text-xs font-bold animate-fade-in-up flex items-center gap-2 mr-2">
                            <Check className="w-3 h-3" />
                            Answer Saved!
                        </div>
                    )}

                    <button
                        disabled={current === 0}
                        onClick={() => setCurrent((c) => c - 1)}
                        className="p-4 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 text-foreground font-bold transition-all duration-300 hover:scale-105 hover:bg-muted shadow-lg disabled:opacity-20 disabled:pointer-events-none group"
                    >
                        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={!tempSelection || tempSelection === answers[current]}
                        className="px-6 h-[56px] rounded-2xl bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/50 text-yellow-600 dark:text-yellow-500 font-black uppercase tracking-widest text-xs transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2 group disabled:opacity-30 disabled:pointer-events-none"
                    >
                        <Save className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        Save Answer
                    </button>

                    {current < activeQuestions.length - 1 ? (
                        <button
                            onClick={() => setCurrent((c) => c + 1)}
                            className="px-8 h-[56px] rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 dark:from-orange-500 dark:to-orange-600 border border-blue-400/50 dark:border-orange-400/50 text-white font-black uppercase tracking-widest text-xs transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_0_30px_rgba(249,115,22,0.3)] flex items-center gap-3 group"
                        >
                            Next Question
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowSubmitModal(true)}
                            className="px-8 h-[56px] rounded-2xl bg-gradient-to-r from-green-500 to-green-600 border border-green-400/50 text-white font-black uppercase tracking-widest text-xs transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] flex items-center gap-3 group"
                        >
                            Submit Quiz
                            <Check className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                        </button>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            {showSubmitModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowSubmitModal(false)} />
                    <div className="relative w-full max-w-sm bg-card/90 backdrop-blur-3xl border border-border/50 rounded-[2rem] p-8 shadow-2xl animate-fade-in-up">
                        <div className="w-20 h-20 rounded-3xl bg-green-500/10 border-2 border-green-500/50 flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-center mb-2">Ready to submit?</h2>
                        <p className="text-center text-muted-foreground text-sm mb-8">
                            You've answered <span className="text-foreground font-bold">{answeredCount}</span> out of <span className="text-foreground font-bold">{activeQuestions.length}</span> questions.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setShowSubmitModal(false)}
                                className="px-6 py-3 rounded-xl bg-muted/50 hover:bg-muted border border-border/50 font-bold transition-all"
                            >
                                Go Back
                            </button>
                            <button
                                onClick={handleFinalSubmit}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold transition-all hover:scale-105"
                            >
                                Yes, Finish
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
