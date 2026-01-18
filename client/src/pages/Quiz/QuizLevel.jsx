import Navbar from "@/components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { Target, TrendingUp, Zap, Flame, Rocket, Crown, ArrowRight } from "lucide-react";
import { useState } from "react";

const levels = [
    { name: "Basic", icon: Target, color: "emerald", description: "Perfect for beginners", questions: 10 },
    { name: "Easy", icon: TrendingUp, color: "green", description: "Build your foundation", questions: 10 },
    { name: "Medium", icon: Zap, color: "yellow", description: "Test your skills", questions: 10 },
    { name: "Intermediate", icon: Flame, color: "orange", description: "Challenge yourself", questions: 10 },
    { name: "Hard", icon: Rocket, color: "red", description: "Push your limits", questions: 10 },
    { name: "Expert", icon: Crown, color: "purple", description: "Master level", questions: 10 },
];

const colorClasses = {
    emerald: {
        bgGradient: "from-emerald-500/50 via-emerald-600/30 to-emerald-500/50",
        border: "border-emerald-500/50",
        shadow: "shadow-emerald-500/10",
        text: "text-emerald-600 dark:text-emerald-400",
        bgIcon: "bg-emerald-500/10",
        icon: "text-emerald-600 dark:text-emerald-400",
        dot: "bg-emerald-500",
        glow: "bg-emerald-500/20"
    },
    green: {
        bgGradient: "from-green-500/50 via-green-600/30 to-green-500/50",
        border: "border-green-500/50",
        shadow: "shadow-green-500/10",
        text: "text-green-600 dark:text-green-400",
        bgIcon: "bg-green-500/10",
        icon: "text-green-600 dark:text-green-400",
        dot: "bg-green-500",
        glow: "bg-green-500/20"
    },
    yellow: {
        bgGradient: "from-yellow-500/50 via-yellow-600/30 to-yellow-500/50",
        border: "border-yellow-500/50",
        shadow: "shadow-yellow-500/10",
        text: "text-yellow-600 dark:text-yellow-400",
        bgIcon: "bg-yellow-500/10",
        icon: "text-yellow-600 dark:text-yellow-400",
        dot: "bg-yellow-500",
        glow: "bg-yellow-500/20"
    },
    orange: {
        bgGradient: "from-orange-500/50 via-orange-600/30 to-orange-500/50",
        border: "border-orange-500/50",
        shadow: "shadow-orange-500/10",
        text: "text-orange-600 dark:text-orange-400",
        bgIcon: "bg-orange-500/10",
        icon: "text-orange-600 dark:text-orange-400",
        dot: "bg-orange-500",
        glow: "bg-orange-500/20"
    },
    red: {
        bgGradient: "from-red-500/50 via-red-600/30 to-red-500/50",
        border: "border-red-500/50",
        shadow: "shadow-red-500/10",
        text: "text-red-600 dark:text-red-400",
        bgIcon: "bg-red-500/10",
        icon: "text-red-600 dark:text-red-400",
        dot: "bg-red-500",
        glow: "bg-red-500/20"
    },
    purple: {
        bgGradient: "from-purple-500/50 via-purple-600/30 to-purple-500/50",
        border: "border-purple-500/50",
        shadow: "shadow-purple-500/10",
        text: "text-purple-600 dark:text-purple-400",
        bgIcon: "bg-purple-500/10",
        icon: "text-purple-600 dark:text-purple-400",
        dot: "bg-purple-500",
        glow: "bg-purple-500/20"
    }
};

export default function QuizLevel() {
    const { topic } = useParams();
    const navigate = useNavigate();
    const [selectedLevel, setSelectedlevel] = useState(null);

    const formattedTopic = topic?.replace(/-/g, " ") || "";

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            {/* Gradient Background Overlay */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 dark:bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/5 dark:bg-orange-600/5 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Header Section */}
                <div className="text-center mb-10 sm:mb-14 space-y-3 animate-fade-in">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold capitalize">
                        <span className="bg-gradient-to-r from-foreground via-blue-600 dark:via-orange-500 to-foreground bg-clip-text text-transparent">
                            {formattedTopic}
                        </span>
                        {" "}Quiz
                    </h1>

                    <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
                        Select your difficulty level to begin the challenge
                    </p>
                </div>

                {/* Level Grid */}
                <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                    {levels.map((level, index) => {
                        const Icon = level.icon;
                        const colors = colorClasses[level.color];

                        return (
                            <div
                                key={level.name}
                                onClick={() => setSelectedlevel(level)}
                                className="group relative cursor-pointer h-full animate-fade-in-up"
                                style={{ animationDelay: `${index * 80}ms` }}
                            >
                                {/* Gradient Border Effect */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${colors.bgGradient} rounded-2xl blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100`} />

                                {/* Card Container */}
                                <div className={`relative h-full bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6 transition-all duration-300 group-hover:border-${level.color}-500/50 group-hover:shadow-2xl group-hover:shadow-${level.color}-500/10 group-hover:-translate-y-1`}>

                                    {/* Icon Container */}
                                    <div className="mb-4 relative">
                                        <div className={`w-14 h-14 rounded-xl ${colors.bgIcon} border ${colors.border} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                            <Icon className={`w-7 h-7 ${colors.icon} transition-colors`} />
                                        </div>

                                        {/* Glow Effect */}
                                        <div className={`absolute inset-0 ${colors.glow} rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-3">
                                        <h3 className={`text-2xl font-bold text-foreground group-hover:${colors.text} transition-colors duration-300`}>
                                            {level.name}
                                        </h3>

                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {level.description}
                                        </p>

                                        {/* Start Button */}
                                        <div className="flex items-center justify-between pt-3 border-t border-border/30">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${colors.dot} animate-pulse`} />
                                                <span className="text-xs text-muted-foreground font-medium">
                                                    Ready to start
                                                </span>
                                            </div>

                                            <div className={`flex items-center gap-1 ${colors.icon} group-hover:gap-2 transition-all duration-300`}>
                                                <span className="text-sm font-semibold">Begin</span>
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shine Effect on Hover */}
                                    <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                                        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Premium Modal with Glassmorphism */}
            {selectedLevel && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setSelectedlevel(null)}
                >
                    {/* Backdrop Overlay */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

                    {/* Modal Container */}
                    <div
                        className="relative w-full max-w-md animate-fade-in-up"
                        onClick={(e) => e.stopPropagation()}
                        style={{ animationDelay: '100ms' }}
                    >
                        {/* Gradient Glow Effect */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[selectedLevel.color].bgGradient} rounded-3xl blur-2xl opacity-50`} />

                        {/* Modal Card */}
                        <div className="relative bg-card/90 backdrop-blur-2xl border border-border/50 rounded-3xl p-8 shadow-2xl">
                            {/* Icon Header */}
                            <div className="flex justify-center mb-6">
                                <div className={`w-20 h-20 rounded-2xl ${colorClasses[selectedLevel.color].bgIcon} border-2 ${colorClasses[selectedLevel.color].border} flex items-center justify-center animate-bounce`}>
                                    {(() => {
                                        const Icon = selectedLevel.icon;
                                        return <Icon className={`w-10 h-10 ${colorClasses[selectedLevel.color].icon}`} />;
                                    })()}
                                </div>
                            </div>

                            {/* Title */}
                            <h2 className={`text-3xl font-bold text-center mb-2 ${colorClasses[selectedLevel.color].icon}`}>
                                {selectedLevel.name} Level
                            </h2>

                            {/* Description */}
                            <p className="text-center text-muted-foreground mb-4">
                                {selectedLevel.description}
                            </p>

                            {/* Info Badges */}
                            <div className="grid grid-cols-2 gap-3 mb-8">
                                <div className={`p-3 rounded-xl ${colorClasses[selectedLevel.color].bgIcon} border ${colorClasses[selectedLevel.color].border} text-center`}>
                                    <span className="block text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1">Questions</span>
                                    <span className={`text-xl font-black ${colorClasses[selectedLevel.color].icon}`}>{selectedLevel.questions}</span>
                                </div>
                                <div className={`p-3 rounded-xl ${colorClasses[selectedLevel.color].bgIcon} border ${colorClasses[selectedLevel.color].border} text-center`}>
                                    <span className="block text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1">Duration</span>
                                    <span className={`text-xl font-black ${colorClasses[selectedLevel.color].icon}`}>{selectedLevel.questions * 1}m</span>
                                </div>
                            </div>

                            {/* Quiz Info */}
                            <div className={`mb-8 p-4 rounded-xl ${colorClasses[selectedLevel.color].bgIcon} border ${colorClasses[selectedLevel.color].border}`}>
                                <div className="flex items-center justify-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${colorClasses[selectedLevel.color].dot} animate-pulse`} />
                                    <span className={`text-sm font-semibold ${colorClasses[selectedLevel.color].icon}`}>
                                        Ready to tackle the challenge?
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setSelectedlevel(null)}
                                    className="flex-1 px-6 py-3 rounded-xl bg-muted/50 hover:bg-muted border border-border/50 text-foreground font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => navigate(`/quiz/${topic}/${selectedLevel.name.toLowerCase()}`)}
                                    className={`flex-1 px-6 py-3 rounded-xl bg-gradient-to-r ${colorClasses[selectedLevel.color].bgGradient} border ${colorClasses[selectedLevel.color].border} text-white font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-${selectedLevel.color}-500/50 flex items-center justify-center gap-2 group`}
                                >
                                    Start Quiz
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                </button>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent dark:from-orange-500/10 rounded-full blur-3xl -z-10" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/10 to-transparent dark:from-orange-600/10 rounded-full blur-3xl -z-10" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
