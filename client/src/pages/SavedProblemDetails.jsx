import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/api';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Calendar, ArrowRight, Loader2, Code, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const SavedProblemDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('cpp');

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const res = await API.get(`/problems/${id}`);
                setProblem(res.data);
                // Set default tab if available
                if (res.data.solutions && Object.keys(res.data.solutions).length > 0) {
                    setActiveTab(Object.keys(res.data.solutions)[0]);
                }
            } catch (error) {
                console.error("Failed to fetch problem:", error);
                toast.error("Failed to load problem details.");
            } finally {
                setLoading(false);
            }
        };
        fetchProblem();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this problem?")) return;
        try {
            await API.delete(`/problems/${id}`);
            toast.success("Problem deleted");
            navigate('/saved-problems');
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Failed to delete problem");
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

    if (loading) {
        return (
            <div className="min-h-screen bg-background text-foreground pb-20">
                <Navbar />
                <div className="flex items-center justify-center h-[80vh]">
                    <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
                </div>
            </div>
        );
    }

    if (!problem) {
        return (
            <div className="min-h-screen bg-background text-foreground pb-20">
                <Navbar />
                <div className="container mx-auto px-4 py-20 text-center">
                    <h2 className="text-2xl font-bold">Problem not found</h2>
                    <button onClick={() => navigate('/saved-problems')} className="mt-4 text-orange-500 hover:underline">
                        Return to Saved Problems
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <Navbar />
            <main className="container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                                <button
                                    onClick={() => navigate('/saved-problems')}
                                    className="p-2 -ml-2 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                                    Saved Problem
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                {problem.title}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-foreground/70">
                                <span className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider text-xs ${problem.difficulty === 'Hard' ? 'bg-red-500/10 text-red-500' :
                                        problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
                                            'bg-green-500/10 text-green-500'
                                    }`}>
                                    {problem.difficulty}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    Saved on {new Date(problem.savedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all w-fit group shrink-0"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>

                    {/* Content */}
                    <div className="grid gap-8">
                        {/* Statement & Constraints */}
                        <div className="p-6 md:p-8 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-xl shadow-sm space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-bold text-foreground/60 uppercase tracking-widest mb-3">Problem Statement</h4>
                                    <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap bg-card/50 p-6 rounded-xl border border-foreground/20 dark:border-border/20 text-lg">
                                        {problem.problemDescription}
                                    </p>
                                </div>
                                {problem.constraints && (
                                    <div>
                                        <h4 className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-3">Constraints</h4>
                                        <div className="font-mono text-sm bg-muted/50 p-4 rounded-lg border border-foreground/20 dark:border-border/20">
                                            {problem.constraints}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Approach & Solution */}
                        <div className="p-6 md:p-8 rounded-2xl border border-orange-500/50 dark:border-orange-500/20 bg-orange-500/5 backdrop-blur-md shadow-sm space-y-8">
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold flex items-center gap-2 text-orange-500">
                                        <Brain className="w-6 h-6" />
                                        Expert Logical Strategy
                                    </h3>
                                    <div className="px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-500 font-mono text-sm font-bold">
                                        {problem.complexity}
                                    </div>
                                </div>
                                <ul className="space-y-3 list-none">
                                    {Array.isArray(problem.approach) ? (
                                        problem.approach.map((point, i) => (
                                            <li key={i} className="flex gap-3 text-foreground/90 leading-relaxed">
                                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-xs font-bold border border-orange-500/30">
                                                    {i + 1}
                                                </span>
                                                {point}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-foreground/90 leading-relaxed">{problem.approach}</li>
                                    )}
                                </ul>
                            </div>

                            {/* Code Area */}
                            {problem.solutions && (
                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-2 p-1.5 bg-muted rounded-xl border border-border/40 w-fit">
                                        {Object.keys(problem.solutions).map((lang) => (
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

                                    <div className="rounded-2xl border border-border/40 bg-zinc-950 overflow-hidden shadow-2xl relative">
                                        <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
                                            <div className="flex gap-1.5">
                                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                                <div className="w-3 h-3 rounded-full bg-orange-500/50" />
                                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                            </div>
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{activeTab} environment</span>
                                        </div>
                                        <pre className="p-6 overflow-x-auto text-sm font-mono leading-relaxed text-zinc-300 min-h-[300px]">
                                            <code>{renderCode(problem.solutions[activeTab], activeTab)}</code>
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SavedProblemDetails;
