import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { Search, Sparkles, ArrowRight, Loader2, Brain, ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';
import toast from 'react-hot-toast';

const AIProblem = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [foundProblem, setFoundProblem] = useState(null);
    const [solvingLoading, setSolvingLoading] = useState(false);
    const [solutionResult, setSolutionResult] = useState(null);
    const [activeTab, setActiveTab] = useState('cpp');

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        setFoundProblem(null);
        setSolutionResult(null);
        try {
            console.log("first");
            const response = await API.post('/ai/search-name', { name: searchQuery }, { withCredentials: true });
            setFoundProblem(response.data);
            console.log("second");
        } catch (error) {
            console.error('Search failed:', error);
            const errorMessage = error.response?.data?.error || "Failed to search problem. Please try again.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSolve = async () => {
        if (!foundProblem) return;
        setSolvingLoading(true);
        try {
            const response = await API.post('/ai/approach', {
                problem: foundProblem.problem,
                constraints: foundProblem.constraints
            });
            setSolutionResult(response.data);
        } catch (error) {
            console.error('Analysis failed:', error);
            const errorMessage = error.response?.data?.error || "Failed to analyze problem. Please try again.";
            toast.error(errorMessage);
        } finally {
            setSolvingLoading(false);
        }
    };

    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        if (!solutionResult || !foundProblem) return;
        try {
            await API.post('/problems/save', {
                title: foundProblem.title || searchQuery,
                problemDescription: foundProblem.problem,
                constraints: foundProblem.constraints,
                tags: foundProblem.tags,
                difficulty: foundProblem.difficulty,
                steps: solutionResult.approach, // Using 'approach' field logic from backend
                approach: solutionResult.approach,
                complexity: solutionResult.complexity,
                solutions: solutionResult.solutions
            });
            toast.success("Problem saved successfully!");
            setSaved(true);
        } catch (error) {
            console.error("Failed to save:", error);
            toast.error("Failed to save problem.");
        }
    };

    const renderCode = (code) => {
        if (!code) return null;
        // Unescape \n \t that may still be literal escape sequences
        const clean = code
            .replace(/\\n/g, '\n')
            .replace(/\\t/g, '    ')
            .replace(/\\r/g, '')
            .replace(/^```[\w]*\n?/, '')
            .replace(/```$/, '')
            .trim();
        return clean;
    };

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <Navbar />
            <main className="container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Header & Navigation */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex flex-col space-y-2">

                            <h1 className="text-3xl font-bold tracking-tight">
                                <span className="text-orange-500 underline decoration-orange-500/30">Search Problem</span>
                            </h1>
                            <p className="text-muted-foreground">
                                Tell the name of the problem, and fetch the full details and constraints.
                            </p>
                        </div>

                        <button
                            onClick={() => navigate('/problems')}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-95 w-fit group shrink-0"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative group">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="e.g. 'Trapping Rain Water' or 'Longest Palindromic Substring'..."
                            className="w-full bg-card/30 border border-border/80 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all font-medium text-lg pr-16 backdrop-blur-xl placeholder:text-foreground/50"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={loading || !searchQuery.trim()}
                            className="absolute right-3 top-3 bottom-3 px-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 transition-colors shadow-lg shadow-orange-500/20"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Results */}
                    {foundProblem && (
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-6">
                            <div className="p-6 md:p-8 rounded-2xl border border-orange-500/50 dark:border-orange-500/20 bg-orange-500/5 backdrop-blur-md space-y-6">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl md:text-3xl font-bold">{foundProblem.title}</h2>
                                        <div className="flex gap-2">
                                            {foundProblem.tags.map(tag => (
                                                <span key={tag} className="text-[10px] uppercase font-bold text-orange-500/70">#{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="px-4 py-1.5 rounded-full bg-orange-500 text-white text-xs font-bold uppercase tracking-wider">
                                        {foundProblem.difficulty}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-bold text-foreground/60 uppercase tracking-widest mb-2">Statement</h4>
                                        <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap bg-card/50 p-6 rounded-xl border border-foreground/20 dark:border-border/20">
                                            {foundProblem.problem}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-2">Constraints</h4>
                                        <div className="font-mono text-sm bg-muted/50 p-4 rounded-lg border border-foreground/20 dark:border-border/20">
                                            {foundProblem.constraints}
                                        </div>
                                    </div>
                                </div>

                                {!solutionResult ? (
                                    <button
                                        onClick={handleSolve}
                                        disabled={solvingLoading}
                                        className="w-full flex items-center justify-center gap-3 p-5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold transition-all shadow-xl shadow-orange-500/20 group"
                                    >
                                        {solvingLoading ? (
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        ) : (
                                            <>
                                                <Brain className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                                Generate Deep Intuition Approaches
                                                <ArrowRight className="w-5 h-5 ml-auto" />
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <div className="mt-8 pt-8 border-t border-orange-500/20 space-y-8 animate-in fade-in zoom-in-95 duration-500">
                                        <div className="p-6 rounded-2xl bg-card border border-orange-500/50 dark:border-orange-500/30 shadow-inner">
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="text-xl font-bold flex items-center gap-2 text-orange-500">
                                                    <Brain className="w-6 h-6" />
                                                    Expert Logical Strategy
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={handleSave}
                                                        disabled={saved}
                                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-xs font-bold uppercase tracking-wider ${saved
                                                            ? 'bg-emerald-500 text-white border-emerald-500 cursor-default'
                                                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                                                            }`}
                                                    >
                                                        {saved ? (
                                                            <>
                                                                <Check className="w-3 h-3" />
                                                                Saved
                                                            </>
                                                        ) : (
                                                            'Save'
                                                        )}
                                                    </button>
                                                    <div className="px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-500 font-mono text-sm font-bold">
                                                        {solutionResult.complexity}
                                                    </div>
                                                </div>
                                            </div>
                                            <ul className="space-y-3 list-none">
                                                {Array.isArray(solutionResult.approach) ? (
                                                    solutionResult.approach.map((point, i) => (
                                                        <li key={i} className="flex gap-3 text-foreground/90 leading-relaxed">
                                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-xs font-bold border border-orange-500/30">
                                                                {i + 1}
                                                            </span>
                                                            {point}
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="text-foreground/90 leading-relaxed">{solutionResult.approach}</li>
                                                )}
                                            </ul>
                                        </div>

                                        <div className="space-y-4">
                                            {/* Language Tabs */}
                                            <div className="flex flex-wrap gap-2 p-1.5 bg-muted rounded-xl border border-border/40 w-fit">
                                                {Object.keys(solutionResult.solutions).map((lang) => (
                                                    <button
                                                        key={lang}
                                                        onClick={() => setActiveTab(lang)}
                                                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${activeTab === lang
                                                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 scale-105'
                                                            : 'text-muted-foreground hover:bg-orange-500/10 hover:text-orange-500'
                                                            }`}
                                                    >
                                                        {lang}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Code Editor Mockup */}
                                            <div className="rounded-2xl border border-border/40 bg-zinc-950 overflow-hidden shadow-2xl relative">
                                                <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
                                                    <div className="flex gap-1.5">
                                                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                                        <div className="w-3 h-3 rounded-full bg-orange-500/50" />
                                                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{activeTab} environment</span>
                                                </div>
                                                <pre className="p-6 overflow-x-auto text-sm font-mono leading-relaxed text-zinc-300 min-h-[300px] whitespace-pre">
                                                    <code>{renderCode(solutionResult.solutions[activeTab])}</code>
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};


export default AIProblem;
