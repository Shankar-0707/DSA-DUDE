import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/api';
import { Bookmark, Clock, ArrowRight, Trash2, ArrowLeft, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SavedProblems = () => {
    const navigate = useNavigate();
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSavedProblems();
    }, []);

    const fetchSavedProblems = async () => {
        try {
            const res = await API.get('/problems/list');
            setProblems(res.data);
        } catch (error) {
            console.error("Failed to fetch saved problems:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Prevent card click
        if (!window.confirm("Are you sure you want to delete this problem?")) return;

        try {
            await API.delete(`/problems/${id}`);
            setProblems(prev => prev.filter(p => p._id !== id));
        } catch (error) {
            console.error("Failed to delete problem:", error);
        }
    };

    const handleViewProblem = (problem) => {
        navigate(`/saved-problem/${problem._id}`);
    };

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <Navbar />
            <main className="container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-5xl mx-auto space-y-8">
                    {/* Header & Navigation */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">
                                Saved <span className="text-orange-500 underline decoration-orange-500/30">Problems</span>
                            </h1>
                            <p className="text-muted-foreground">
                                Your personal collection of solved algorithms and challenges.
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

                    {/* List */}
                    {loading ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-40 rounded-2xl bg-muted/50 animate-pulse" />
                            ))}
                        </div>
                    ) : problems.length === 0 ? (
                        <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border/50">
                            <Bookmark className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                            <h3 className="text-xl font-bold text-muted-foreground">No saved problems yet</h3>
                            <p className="text-sm text-muted-foreground/70 mt-2">
                                Solve a problem and click the "Save" button to add it here.
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {problems.map((problem) => (
                                <div
                                    key={problem._id}
                                    onClick={() => handleViewProblem(problem)}
                                    className="group relative p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm hover:border-orange-500/30 hover:shadow-lg transition-all cursor-pointer flex flex-col gap-4"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-lg line-clamp-1 group-hover:text-orange-500 transition-colors">
                                                {problem.title}
                                            </h3>
                                            <div className="flex gap-2 text-xs">
                                                <span className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${problem.difficulty === 'Hard' ? 'bg-red-500/10 text-red-500' :
                                                    problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
                                                        'bg-green-500/10 text-green-500'
                                                    }`}>
                                                    {problem.difficulty}
                                                </span>
                                                <span className="flex items-center gap-1 text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(problem.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => handleDelete(e, problem._id)}
                                            className="p-2 -mr-2 -mt-2 rounded-lg text-muted-foreground/50 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                            {problem.problemDescription}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs font-bold text-orange-500/80 uppercase tracking-widest pt-4 border-t border-border/40">
                                        <Code className="w-4 h-4" />
                                        View Solution <ArrowRight className="w-3 h-3 ml-auto group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SavedProblems;
