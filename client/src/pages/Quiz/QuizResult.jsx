import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    Trophy,
    ArrowLeft,
    RotateCcw,
    Home,
    CheckCircle2,
    XCircle,
    ChevronDown,
    ChevronUp,
    Clock,
    Target,
    Zap
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default function QuizResult() {
    const { topic, level } = useParams();
    const navigate = useNavigate();
    const storageKey = `quiz_${topic}_${level}`;

    const [result, setResult] = useState(null);
    const [expandedIndex, setExpandedIndex] = useState(null);

    useEffect(() => {
        const savedResult = localStorage.getItem(`${storageKey}_result`);
        if (savedResult) {
            setResult(JSON.parse(savedResult));
        } else {
            // If no result found, redirect back to quiz level selection
            navigate(`/quiz/${topic}`);
        }
    }, [storageKey, navigate, topic]);

    if (!result) return null;

    const { score, detailed, timeTaken } = result;
    const totalQuestions = detailed.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const formattedTopic = topic?.replace(/-/g, " ") || "";

    // Format time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Determine performance level for UI feedback
    const getPerformanceInfo = () => {
        if (percentage >= 80) return { label: "Excellent!", color: "text-green-500", icon: Trophy, bg: "bg-green-500/10", border: "border-green-500/50" };
        if (percentage >= 50) return { label: "Good Job!", color: "text-blue-500", icon: Target, bg: "bg-blue-500/10", border: "border-blue-500/50" };
        return { label: "Keep Practicing!", color: "text-orange-500", icon: Zap, bg: "bg-orange-500/10", border: "border-orange-500/50" };
    };

    const performance = getPerformanceInfo();

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />

            <div className="flex-1 container max-w-4xl mx-auto px-6 py-12">
                {/* Header Section */}
                <div className="text-center mb-12 animate-fade-in">
                    <div className={`inline-flex items-center justify-center p-6 rounded-[2.5rem] ${performance.bg} ${performance.border} border-2 mb-6 shadow-2xl`}>
                        <performance.icon className={`w-16 h-16 ${performance.color} animate-bounce`} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-foreground via-blue-600 dark:via-orange-500 to-foreground bg-clip-text text-transparent">
                        {performance.label}
                    </h1>
                    <p className="text-muted-foreground uppercase tracking-[0.3em] text-xs font-black">
                        Quiz Completed: {formattedTopic} ({level})
                    </p>
                </div>

                {/* Score Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-6 text-center shadow-lg hover:border-blue-500/30 transition-all group overflow-hidden relative">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all" />
                        <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-2">Score</p>
                        <h2 className="text-4xl font-black text-blue-600 dark:text-orange-500">{score} / {totalQuestions}</h2>
                    </div>

                    <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-6 text-center shadow-lg hover:border-blue-500/30 transition-all group overflow-hidden relative">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all" />
                        <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-2">Accuracy</p>
                        <h2 className="text-4xl font-black text-blue-600 dark:text-orange-500">{percentage}%</h2>
                    </div>

                    <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-6 text-center shadow-lg hover:border-blue-500/30 transition-all group overflow-hidden relative">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all" />
                        <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-2">Time Taken</p>
                        <h2 className="text-4xl font-black text-blue-600 dark:text-orange-500">{formatTime(timeTaken)}</h2>
                    </div>

                    <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-6 text-center shadow-lg hover:border-blue-500/30 transition-all group overflow-hidden relative">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all" />
                        <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-2">Result</p>
                        <h2 className={`text-2xl font-black mt-2 ${percentage >= 50 ? 'text-green-500' : 'text-red-500'}`}>
                            {percentage >= 50 ? "PASSED" : "FAILED"}
                        </h2>
                    </div>
                </div>

                {/* Question Review Section */}
                <div className="space-y-6 mb-12">
                    <h3 className="text-xl font-bold px-2 flex items-center gap-2">
                        <CheckCircle2 className="w-6 h-6 text-blue-500 dark:text-orange-500" />
                        Detailed Review
                    </h3>

                    {detailed.map((item, idx) => (
                        <div
                            key={idx}
                            className={`group bg-card/30 backdrop-blur-xl border border-border/50 rounded-3xl overflow-hidden transition-all duration-300 ${expandedIndex === idx ? 'ring-2 ring-blue-500/30 ring-offset-2 ring-offset-background' : ''}`}
                        >
                            <button
                                onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-white/5 transition-all"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                                        <span className="text-[9px] font-black tracking-widest uppercase bg-muted px-2 py-0.5 rounded-md text-muted-foreground">Q{idx + 1}</span>
                                        {item.isCorrect ? (
                                            <span className="text-[9px] font-black tracking-widest uppercase text-green-500 flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" /> Correct
                                            </span>
                                        ) : (
                                            <span className="text-[9px] font-black tracking-widest uppercase text-red-500 flex items-center gap-1">
                                                <XCircle className="w-3 h-3" /> Incorrect
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-sm sm:text-base font-bold text-foreground leading-snug truncate ${expandedIndex === idx ? 'whitespace-pre-wrap truncate-none' : 'truncate'} font-mono`}>
                                        {item.question}
                                    </p>
                                </div>
                                <div className="shrink-0 p-1.5 rounded-lg bg-muted/30 group-hover:bg-muted/50 transition-colors">
                                    {expandedIndex === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </div>
                            </button>

                            {expandedIndex === idx && (
                                <div className="px-6 pb-6 pt-2 animate-fade-in-up">
                                    <div className="h-px bg-border/50 mb-6" />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                        {item.options.map((option, oIdx) => {
                                            const isCorrectAnswer = option === item.correctAnswer;
                                            const isUserAnswer = option === item.userAnswer;

                                            let style = "bg-white/5 border-border/30 text-muted-foreground";
                                            if (isCorrectAnswer) style = "bg-green-500/10 border-green-500/50 text-green-600 dark:text-green-400 font-bold";
                                            if (isUserAnswer && !item.isCorrect) style = "bg-red-500/10 border-red-500/50 text-red-600 dark:text-red-400 font-bold";

                                            return (
                                                <div key={oIdx} className={`p-4 rounded-2xl border flex items-center gap-3 ${style}`}>
                                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${isCorrectAnswer ? 'bg-green-500 text-white' : isUserAnswer ? 'bg-red-500 text-white' : 'bg-muted'}`}>
                                                        {String.fromCharCode(65 + oIdx)}
                                                    </div>
                                                    {option}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="bg-blue-500/5 dark:bg-orange-500/5 rounded-2xl p-6 border border-blue-500/10 dark:border-orange-500/10">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Zap className="w-4 h-4 text-blue-500 dark:text-orange-500" />
                                            <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-orange-500">Explanation</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed italic">
                                            {item.explanation}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in delay-500">
                    <button
                        onClick={() => navigate(`/quiz/${topic}`)}
                        className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 dark:from-orange-500 dark:to-orange-600 text-white font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-3"
                    >
                        <RotateCcw className="w-5 h-5" />
                        Try Another Level
                    </button>

                    <button
                        onClick={() => navigate('/home')}
                        className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 text-foreground font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-3"
                    >
                        <Home className="w-5 h-5" />
                        Back to Home
                    </button>
                </div>
            </div>

            {/* Background Glows */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[15%] w-[600px] h-[600px] bg-blue-500/5 dark:bg-orange-500/5 rounded-full blur-[140px] animate-pulse" />
                <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-purple-500/5 dark:bg-orange-600/5 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>
        </div>
    );
}
