import Navbar from "@/components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { Target, TrendingUp, Zap, Flame, Rocket, Crown, ArrowRight } from "lucide-react";

const levels = [
    { name: "Basic", icon: Target, color: "emerald", description: "Perfect for beginners" },
    { name: "Easy", icon: TrendingUp, color: "green", description: "Build your foundation" },
    { name: "Medium", icon: Zap, color: "yellow", description: "Test your skills" },
    { name: "Intermediate", icon: Flame, color: "orange", description: "Challenge yourself" },
    { name: "Hard", icon: Rocket, color: "red", description: "Push your limits" },
    { name: "Expert", icon: Crown, color: "purple", description: "Master level" },
];

const colorClasses = {
    emerald: {
        light: "from-emerald-500/50 via-emerald-600/30 to-emerald-500/50 border-emerald-500/50 shadow-emerald-500/10 text-emerald-600 bg-emerald-500/10",
        dark: "dark:from-emerald-500/50 dark:via-emerald-600/30 dark:to-emerald-500/50 dark:border-emerald-500/50 dark:shadow-emerald-500/10 dark:text-emerald-400 dark:bg-emerald-500/10",
        icon: "text-emerald-600 dark:text-emerald-400",
        dot: "bg-emerald-500"
    },
    green: {
        light: "from-green-500/50 via-green-600/30 to-green-500/50 border-green-500/50 shadow-green-500/10 text-green-600 bg-green-500/10",
        dark: "dark:from-green-500/50 dark:via-green-600/30 dark:to-green-500/50 dark:border-green-500/50 dark:shadow-green-500/10 dark:text-green-400 dark:bg-green-500/10",
        icon: "text-green-600 dark:text-green-400",
        dot: "bg-green-500"
    },
    yellow: {
        light: "from-yellow-500/50 via-yellow-600/30 to-yellow-500/50 border-yellow-500/50 shadow-yellow-500/10 text-yellow-600 bg-yellow-500/10",
        dark: "dark:from-yellow-500/50 dark:via-yellow-600/30 dark:to-yellow-500/50 dark:border-yellow-500/50 dark:shadow-yellow-500/10 dark:text-yellow-400 dark:bg-yellow-500/10",
        icon: "text-yellow-600 dark:text-yellow-400",
        dot: "bg-yellow-500"
    },
    orange: {
        light: "from-orange-500/50 via-orange-600/30 to-orange-500/50 border-orange-500/50 shadow-orange-500/10 text-orange-600 bg-orange-500/10",
        dark: "dark:from-orange-500/50 dark:via-orange-600/30 dark:to-orange-500/50 dark:border-orange-500/50 dark:shadow-orange-500/10 dark:text-orange-400 dark:bg-orange-500/10",
        icon: "text-orange-600 dark:text-orange-400",
        dot: "bg-orange-500"
    },
    red: {
        light: "from-red-500/50 via-red-600/30 to-red-500/50 border-red-500/50 shadow-red-500/10 text-red-600 bg-red-500/10",
        dark: "dark:from-red-500/50 dark:via-red-600/30 dark:to-red-500/50 dark:border-red-500/50 dark:shadow-red-500/10 dark:text-red-400 dark:bg-red-500/10",
        icon: "text-red-600 dark:text-red-400",
        dot: "bg-red-500"
    },
    purple: {
        light: "from-purple-500/50 via-purple-600/30 to-purple-500/50 border-purple-500/50 shadow-purple-500/10 text-purple-600 bg-purple-500/10",
        dark: "dark:from-purple-500/50 dark:via-purple-600/30 dark:to-purple-500/50 dark:border-purple-500/50 dark:shadow-purple-500/10 dark:text-purple-400 dark:bg-purple-500/10",
        icon: "text-purple-600 dark:text-purple-400",
        dot: "bg-purple-500"
    }
};

export default function QuizLevel() {
    const { topic } = useParams();
    const navigate = useNavigate();

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
                                onClick={() => console.log(`Topic: ${topic}, Level: ${level.name}`)}
                                className="group relative cursor-pointer h-full animate-fade-in-up"
                                style={{ animationDelay: `${index * 80}ms` }}
                            >
                                {/* Gradient Border Effect */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${colors.light} ${colors.dark} rounded-2xl blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100`} />

                                {/* Card Container */}
                                <div className={`relative h-full bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6 transition-all duration-300 group-hover:border-${level.color}-500/50 group-hover:shadow-2xl group-hover:shadow-${level.color}-500/10 group-hover:-translate-y-1`}>

                                    {/* Icon Container */}
                                    <div className="mb-4 relative">
                                        <div className={`w-14 h-14 rounded-xl ${colors.light.split(' ')[4]} ${colors.dark.split(' ')[4]} border ${colors.light.split(' ')[1]} ${colors.dark.split(' ')[1]} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                            <Icon className={`w-7 h-7 ${colors.icon} transition-colors`} />
                                        </div>

                                        {/* Glow Effect */}
                                        <div className={`absolute inset-0 ${colors.light.split(' ')[4]} ${colors.dark.split(' ')[4]} rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-3">
                                        <h3 className={`text-2xl font-bold text-foreground group-hover:${colors.light.split(' ')[3]} group-hover:${colors.dark.split(' ')[3]} transition-colors duration-300`}>
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
        </div>
    );
}
