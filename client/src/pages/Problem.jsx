import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Search, PlusCircle, Sparkles, ArrowRight, Loader2, Brain, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

const Problem = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main className="container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-5xl mx-auto space-y-12">
                    {/* Header & Navigation */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex flex-col space-y-4 text-center md:text-left">
                            <h1 className="text-4xl font-bold tracking-tight">
                                Choose Your <span className="text-orange-500 underline decoration-orange-500/30">Path</span>
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-2xl">
                                Whether you want AI to find a problem for you or you want to provide your own contest details, we've got the strategy ready.
                            </p>
                        </div>

                        <button
                            onClick={() => navigate('/home')}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-95 w-fit group shrink-0"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back
                        </button>
                    </div>

                    {/* Action Cards */}
                    <div className="grid gap-8 md:grid-cols-2">
                        {/* AI Search Card */}
                        <div
                            onClick={() => navigate('/problems/ai')}
                            className="p-8 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-xl shadow-xl shadow-orange-500/5 space-y-6 flex flex-col group cursor-pointer hover:border-orange-500/50 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                                    <Sparkles className="w-7 h-7 text-orange-500" />
                                </div>
                                <h3 className="text-2xl font-bold tracking-tight">AI Smart Search</h3>
                            </div>
                            <div className="flex-1 py-4">
                                <p className="text-lg text-foreground/70 leading-relaxed">
                                    Can't find the problem statement? Just type the name, and our AI will fetch everything from our vast database.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-orange-500 font-bold uppercase tracking-widest text-xs group-hover:translate-x-2 transition-transform">
                                Launch AI Explorer <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>

                        {/* Manual Input Card */}
                        <div
                            onClick={() => navigate('/problems/manual')}
                            className="p-8 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-xl shadow-xl shadow-orange-500/5 space-y-6 flex flex-col group cursor-pointer hover:border-orange-500/50 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                                    <PlusCircle className="w-7 h-7 text-orange-500" />
                                </div>
                                <h3 className="text-2xl font-bold tracking-tight">Expert Manual Entry</h3>
                            </div>
                            <div className="flex-1 py-4">
                                <p className="text-lg text-foreground/70 leading-relaxed">
                                    Got a custom problem or a specific contest question? Paste it directly for high-level algorithmic analysis.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-orange-500 font-bold uppercase tracking-widest text-xs group-hover:translate-x-2 transition-transform">
                                Go to Manual Mode <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Problem;
