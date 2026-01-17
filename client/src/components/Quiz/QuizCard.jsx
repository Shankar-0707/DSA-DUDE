import { ArrowRight, BookOpen, Code2, Database, GitBranch, Layers, ListTree, Network, Repeat, Boxes } from "lucide-react";
import { useNavigate } from "react-router-dom";

const topicIcons = {
    "Array": Boxes,
    "String": Code2,
    "Linked List": ListTree,
    "Stack": Layers,
    "Queue": Repeat,
    "Binary Search": Database,
    "Tree": GitBranch,
    "Graph": Network,
    "Dynamic Programming": BookOpen,
};

export default function QuizCard({ name, questions = 20 }) {
    const navigate = useNavigate();
    const Icon = topicIcons[name] || Code2;

    return (
        <div
            onClick={() => navigate(`/quiz/${name.toLowerCase().replace(" ", "-")}`)}
            className="group relative cursor-pointer h-full"
        >
            {/* Gradient Border Effect - Blue in light mode, Orange in dark mode */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/50 group-hover:via-blue-600/30 group-hover:to-blue-500/50 dark:from-orange-500/0 dark:via-orange-500/0 dark:to-orange-500/0 dark:group-hover:from-orange-500/50 dark:group-hover:via-orange-600/30 dark:group-hover:to-orange-500/50 rounded-2xl blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100" />

            {/* Card Container */}
            <div className="relative h-full bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6 transition-all duration-300 group-hover:border-blue-500/50 dark:group-hover:border-orange-500/50 group-hover:shadow-2xl group-hover:shadow-blue-500/10 dark:group-hover:shadow-orange-500/10 group-hover:-translate-y-1">

                {/* Icon Container */}
                <div className="mb-4 relative">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 dark:from-orange-500/10 dark:to-orange-600/5 border border-blue-500/20 dark:border-orange-500/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <Icon className="w-7 h-7 text-blue-600 dark:text-orange-500 group-hover:text-blue-500 dark:group-hover:text-orange-400 transition-colors" />
                    </div>

                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-blue-500/20 dark:bg-orange-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="space-y-3">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-orange-500 transition-colors duration-300">
                        {name}
                    </h3>

                   

                    {/* Metadata */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/30">
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-orange-500 animate-pulse" />
                            <span className="text-muted-foreground font-medium">
                                {questions} Questions
                            </span>
                        </div>

                        {/* Start Arrow */}
                        <div className="flex items-center gap-1 text-blue-600 dark:text-orange-500 group-hover:gap-2 transition-all duration-300">
                            <span className="text-sm font-semibold">Start</span>
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
}
