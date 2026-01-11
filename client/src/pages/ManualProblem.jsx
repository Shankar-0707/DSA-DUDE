import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Settings2, ArrowRight, Loader2, BrainCircuit, ArrowLeft, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../api/api';
import toast from 'react-hot-toast';

const ManualProblem = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [problem, setProblem] = useState('');
    const [constraints, setConstraints] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [activeTab, setActiveTab] = useState('cpp');

    // Load state from navigation if available
    useEffect(() => {
        if (location.state?.problem) {
            setProblem(location.state.problem);
            setConstraints(location.state.constraints || '');
        }
    }, [location.state]);

    const handleSolve = async () => {
        if (!problem.trim()) return;
        setLoading(true);
        try {
            const response = await API.post('/ai/approach', { problem, constraints });
            setResult(response.data);
        } catch (error) {
            console.error('Solve failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        if (!result || !problem) return;
        try {
            await API.post('/problems/save', {
                title: "Manual Problem", // Default title as we don't ask for one
                problemDescription: problem,
                constraints: constraints,
                tags: ["Manual"],
                difficulty: "Unknown",
                steps: result.approach,
                approach: result.approach,
                complexity: result.complexity,
                solutions: result.solutions
            });
            toast.success("Problem saved successfully!");
            setSaved(true);
        } catch (error) {
            console.error("Failed to save:", error);
            toast.error("Failed to save problem.");
        }
    };

    const renderCode = (code, lang) => {
        if (!code) return null;
        const cleanCode = code.replace(/`/g, '');
        return cleanCode.split('\n').map((line, i) => {
            const commentChar = lang === 'python' ? '#' : '//';
            const commentIndex = line.indexOf(commentChar);

            if (commentIndex !== -1) {
                const codePart = line.substring(0, commentIndex);
                const commentPart = line.substring(commentIndex);
                return (
                    <div key={i} className="leading-relaxed whitespace-pre">
                        <span>{codePart}</span>
                        <span className="text-green-500 italic">{commentPart}</span>
                    </div>
                );
            }
            return <div key={i} className="leading-relaxed whitespace-pre">{line || '\n'}</div>;
        });
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
                                Manual <span className="text-orange-500 underline decoration-orange-500/30">Problem Input</span>
                            </h1>
                            <p className="text-muted-foreground">
                                Paste your problem statement and constraints below for high-level AI analysis.
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

                    <div className="grid gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-foreground/80">Problem Description</label>
                            <textarea
                                value={problem}
                                onChange={(e) => setProblem(e.target.value)}
                                placeholder="Paste the problem description here..."
                                className="min-h-[200px] w-full p-4 rounded-xl border border-foreground/20 dark:border-border/40 bg-card/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all resize-none shadow-inner placeholder:text-foreground/50"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-foreground/80">Constraints (Optional)</label>
                            <textarea
                                value={constraints}
                                onChange={(e) => setConstraints(e.target.value)}
                                placeholder="Size of input, time limits, etc..."
                                className="min-h-[100px] w-full p-4 rounded-xl border border-foreground/20 dark:border-border/40 bg-card/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all resize-none shadow-inner placeholder:text-foreground/50"
                            />
                        </div>

                        <Button
                            onClick={handleSolve}
                            disabled={loading || !problem.trim()}
                            className="bg-orange-500 hover:bg-orange-600 text-white h-14 text-lg font-bold rounded-2xl shadow-xl shadow-orange-500/20 transition-all active:scale-95"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin mr-3" />
                                    Analyzing Strategy...
                                </>
                            ) : (
                                <>
                                    Get AI Approaches
                                    <ArrowRight className="w-6 h-6 ml-3" />
                                </>
                            )}
                        </Button>
                    </div>

                    {result && (
                        <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
                            <div className="p-6 md:p-8 rounded-2xl border border-orange-500/50 dark:border-orange-500/20 bg-card/50 shadow-inner backdrop-blur-md">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-orange-500">
                                        <BrainCircuit className="w-6 h-6 md:w-8 md:h-8" />
                                        Algorithmic Insight
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
                                        <div className="px-4 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 font-mono font-bold">
                                            {result.complexity}
                                        </div>
                                    </div>
                                </div>
                                <ul className="space-y-4 list-none">
                                    {Array.isArray(result.approach) ? (
                                        result.approach.map((point, i) => (
                                            <li key={i} className="flex gap-4 text-foreground/90 leading-relaxed text-base md:text-lg">
                                                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-xs font-bold border border-orange-500/30">
                                                    {i + 1}
                                                </span>
                                                {point}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-foreground/90 leading-relaxed text-lg">{result.approach}</li>
                                    )}
                                </ul>
                            </div>

                            <div className="space-y-4">
                                {/* Language Tabs */}
                                <div className="flex flex-wrap gap-2 p-1.5 bg-muted rounded-xl border border-border/40 w-fit">
                                    {Object.keys(result.solutions).map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => setActiveTab(lang)}
                                            className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase transition-all ${activeTab === lang
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
                                    <pre className="p-8 overflow-x-auto text-sm font-mono leading-relaxed text-zinc-300 min-h-[350px]">
                                        <code>{renderCode(result.solutions[activeTab], activeTab)}</code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};


export default ManualProblem;
