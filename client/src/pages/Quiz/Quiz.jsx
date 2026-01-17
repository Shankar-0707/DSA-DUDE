import { useState } from "react";
import QuizCard from "@/components/Quiz/QuizCard";
import Navbar from "@/components/Navbar";
import { Search, Sparkles } from "lucide-react";

const quizTopics = [
    { id: 1, name: "Array", questions: 15 },
    { id: 2, name: "String", questions: 15 },
    { id: 3, name: "Linked List", questions: 15 },
    { id: 4, name: "Stack", questions: 15 },
    { id: 5, name: "Queue", questions: 15 },
    { id: 6, name: "Binary Search", questions: 12 },
    { id: 7, name: "Tree", questions: 10 },
    { id: 8, name: "Graph", questions: 10 },
    { id: 9, name: "Dynamic Programming", questions: 10 },
];

export default function Quiz() {
    const [search, setSearch] = useState("");

    const filteredTopics = quizTopics.filter((topic) =>
        topic.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            {/* Gradient Background Overlay */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Hero Section */}
                <div className="text-center mb-10 sm:mb-14 space-y-4 animate-fade-in">


                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-foreground via-orange-500 to-foreground bg-clip-text text-transparent leading-tight">
                        DSA Quiz Challenge
                    </h1>

                    <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                        Choose a topic and test your understanding
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-12 sm:mb-16">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 dark:from-orange-500/20 dark:to-orange-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                        <div className="relative bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 group-hover:border-blue-500/30 dark:group-hover:border-orange-500/30">
                            <div className="flex items-center gap-3 px-5 py-4">
                                <Search className="w-5 h-5 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-orange-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search for a DSA topic..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base"
                                />
                                {search && (
                                    <button
                                        onClick={() => setSearch("")}
                                        className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cards Grid */}
                {filteredTopics.length > 0 ? (
                    <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
                        {filteredTopics.map((topic, index) => (
                            <div
                                key={topic.id}
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <QuizCard name={topic.name} questions={topic.questions} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 animate-fade-in">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                            <Search className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No topics found</h3>
                        <p className="text-muted-foreground">
                            Try searching with a different keyword
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
