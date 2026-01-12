import React from 'react';
import Navbar from '../components/Navbar';
import { ArrowRight, Brain, Zap, Code2, Search, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-foreground relative">
            <Navbar />

            {/* Background Ripple */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-50 z-0">
                <BackgroundRippleEffect />
            </div>

            {/* Content Wrapper - Ensure relative z-index to sit on top */}
            <div className="relative z-10">

                {/* Hero Section */}
                <header className="relative overflow-hidden pt-16 md:pt-24 pb-16">
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto text-center space-y-8">


                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                                Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">DSA</span> with <br className="hidden md:block" />
                                Deep Intuition
                            </h1>

                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                                Your personal AI companion for cracking coding interviews. Get expert breakdowns, consistent logic, and multi-language solutions instantly.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                                <button
                                    onClick={() => navigate('/problems')}
                                    className="px-8 py-4 rounded-xl bg-orange-500 text-white text-lg font-bold shadow-xl shadow-orange-500/20 hover:bg-orange-600 hover:scale-105 transition-all active:scale-95 flex items-center gap-2"
                                >
                                    Start Solving Now
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => navigate('/profile')}
                                    className="px-8 py-4 rounded-xl bg-card border border-border/50 text-foreground font-bold hover:bg-muted/50 transition-all flex items-center gap-2"
                                >
                                    View Profile
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Background Decoration */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full -z-10" />
                </header>

                {/* What is DSA? Section */}
                <section className="py-20 bg-muted/30 border-y border-border/40">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto space-y-12">
                            <div className="text-center space-y-4">
                                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                                    What is <span className="text-orange-500 underline decoration-orange-500/30 underline-offset-8">DSA</span>?
                                </h2>
                                <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                                    The building blocks of software engineering that define how we store and process data efficiently.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="p-8 rounded-3xl bg-card border border-border/50 space-y-4 hover:shadow-2xl transition-all duration-500 group">
                                    <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl shadow-orange-500/5">
                                        <Code2 className="w-8 h-8 text-orange-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold italic">Data Structures</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        The specialized format for organizing and storing data. Think of it as a <span className="text-foreground font-medium underline decoration-orange-500/20">container</span> that holds information in a way that makes it easy to access and modify.
                                    </p>
                                </div>

                                <div className="p-8 rounded-3xl bg-card border border-border/50 space-y-4 hover:shadow-2xl transition-all duration-500 group">
                                    <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl shadow-orange-500/5">
                                        <Zap className="w-8 h-8 text-orange-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold italic">Algorithms</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        The step-by-step instructions for solving a problem. It's the <span className="text-foreground font-medium underline decoration-orange-500/20">logic</span> used to perform operations on your data structures to reach a desired outcome.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* DSA Roadmap Section */}
                <section className="py-24 relative overflow-hidden">
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-6xl mx-auto space-y-16">
                            <div className="text-center space-y-4">
                                <h2 className="text-4xl md:text-6xl font-bold italic">The Roadmap to Mastery</h2>
                                <p className="text-muted-foreground text-lg">Your step-by-step guide from foundations to elite technical interviews.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                                {/* Roadmap Steps */}
                                <RoadmapStep
                                    number="01"
                                    title="Foundations"
                                    topics={["Arrays", "Strings", "Complexity Analysis"]}
                                    color="bg-orange-500"
                                />
                                <RoadmapStep
                                    number="02"
                                    title="Linear Structures"
                                    topics={["Linked Lists", "Stacks", "Queues"]}
                                    color="bg-amber-500"
                                />
                                <RoadmapStep
                                    number="03"
                                    title="Hierarchical"
                                    topics={["Trees", "Graphs", "Heaps"]}
                                    color="bg-orange-400"
                                />
                                <RoadmapStep
                                    number="04"
                                    title="Advanced Logic"
                                    topics={["DP", "Sliding Window", "Greedy"]}
                                    color="bg-orange-600"
                                />
                            </div>

                            <div className="pt-12 flex justify-center">
                                <div className="p-1 px-1 bg-muted rounded-full border border-border/50 flex items-center gap-4">
                                    <button className="px-6 py-2 rounded-full text-sm font-bold bg-orange-500 text-white shadow-lg">Begin Learning</button>
                                    <span className="text-xs text-muted-foreground pr-6 font-medium">Over 200+ Interactive Problems</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Roadmap Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-orange-500/5 blur-[150px] -z-10" />
                </section>
            </div>
        </div>
    );
};

// Helper Components
function RoadmapStep({ number, title, topics, color }) {
    return (
        <div className="relative p-6 rounded-3xl bg-card border border-border/50 hover:border-orange-500/30 transition-all group overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-[0.03] -mr-8 -mt-8 rounded-full group-hover:scale-150 transition-transform duration-700`} />
            <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                    <span className={`text-4xl font-black opacity-10 font-mono`}>{number}</span>
                    <div className={`w-2 h-2 rounded-full ${color}`} />
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-3">{title}</h3>
                    <ul className="space-y-2">
                        {topics.map((topic, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                                <div className={`w-1 h-1 rounded-full ${color}/50`} />
                                {topic}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="p-6 rounded-2xl bg-background border border-border/50 hover:border-orange-500/30 hover:shadow-lg transition-all space-y-4 group">
            <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">
                {description}
            </p>
        </div>
    );
}

function ListItem({ text }) {
    return (
        <li className="flex items-center gap-3 font-medium text-foreground/80">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            {text}
        </li>
    );
}

function Sparkles({ className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M9 5h4" />
        </svg>
    )
}

export default Home;
