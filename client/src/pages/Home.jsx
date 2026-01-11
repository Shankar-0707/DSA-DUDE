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

                {/* Features Grid */}
                <section className="py-20 bg-muted/30 border-y border-border/40">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            <FeatureCard
                                icon={<Search className="w-8 h-8 text-orange-500" />}
                                title="Instant Problem Search"
                                description="Can't find a problem? Just type the name. Our AI fetches details from our vast database of LeetCode & CP problems."
                            />
                            <FeatureCard
                                icon={<Brain className="w-8 h-8 text-orange-500" />}
                                title="Deep Logic Breakdowns"
                                description="Don't just memorize code. Understand the 'Why' and 'How' with our step-by-step intuitive explanations."
                            />
                            <FeatureCard
                                icon={<Code2 className="w-8 h-8 text-orange-500" />}
                                title="Multi-Language Support"
                                description="Get optimized solutions in C++, Java, and Python automatically, with green-highlighted comments."
                            />
                        </div>
                    </div>
                </section>

                {/* How It Works Snippet */}
                <section className="py-20 container mx-auto px-4">
                    <div className="max-w-5xl mx-auto bg-card rounded-3xl border border-border/50 overflow-hidden shadow-2xl relative">
                        <div className="grid md:grid-cols-2">
                            <div className="p-8 md:p-12 space-y-6 flex flex-col justify-center">
                                <h2 className="text-3xl font-bold">Why DSA-DUDE?</h2>
                                <ul className="space-y-4">
                                    <ListItem text="Save hours of searching for editorials" />
                                    <ListItem text="Understand complex constraints easily" />
                                    <ListItem text="Prepare for FAANG interviews efficiently" />
                                    <ListItem text="Track your daily consistency" />
                                </ul>
                            </div>
                            <div className="bg-muted/50 p-8 md:p-12 flex items-center justify-center border-l border-border/50">
                                <div className="text-center space-y-4">
                                    <div className="inline-block p-4 rounded-2xl bg-orange-500/10 mb-2">
                                        <Zap className="w-12 h-12 text-orange-500" />
                                    </div>
                                    <h3 className="text-xl font-bold">Lightning Fast Analysis</h3>
                                    <p className="text-muted-foreground text-sm">
                                        "I pasted a hard DP problem and got a recursive solution with memoization in seconds."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

// Helper Components
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
