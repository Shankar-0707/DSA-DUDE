import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ArrayVisualizer from "../visualizers/ArrayVisualizer";
import API from "@/api/api";
import Navbar from "../components/Navbar";
import { Play, CheckCircle, XCircle, Loader2, Sparkles, ChevronRight, ArrowLeft, Copy, Check } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Visualize() {
    const navigate = useNavigate();
    const [problem, setProblem] = useState("");
    const [constraints, setConstraints] = useState("");
    const [code, setCode] = useState("");
    const [customInput, setCustomInput] = useState("[1, -1, 2, 3]");

    const [validation, setValidation] = useState(null);
    const [trace, setTrace] = useState(null);
    const [loading, setLoading] = useState(false);
    const [visualizing, setVisualizing] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const validateCode = async () => {
        setLoading(true);
        setTrace(null);
        setValidation(null);

        try {
            const res = await API.post(
                "/visualize/validate",
                { problem, constraints, code }
            );
            setValidation(res.data);
            if (res.data.suggestedInput) {
                setCustomInput(res.data.suggestedInput);
            }
        } catch (error) {
            console.error("Validation error:", error);
        } finally {
            setLoading(false);
        }
    };

    const visualize = async () => {
        setVisualizing(true);
        const finalCode = validation?.correctedCode || code;

        try {
            let parsedInput;
            try {
                parsedInput = JSON.parse(customInput);
            } catch (e) {
                alert("Invalid input format. Please provide a JSON array like [1, 2, 3]");
                setVisualizing(false);
                return;
            }

            const res = await API.post(
                "/visualize/trace",
                {
                    code: finalCode,
                    input: parsedInput,
                    problemType: validation?.problemType || "array"
                }
            );
            setTrace(res.data);
        } catch (error) {
            console.error("Visualization error:", error);
        } finally {
            setVisualizing(false);
        }
    };

    const handleCopy = () => {
        if (validation?.correctedCode) {
            navigator.clipboard.writeText(validation.correctedCode);
            setIsCopied(true);
            toast.success("Code copied to clipboard!");
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-sans selection:bg-orange-500/30">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header & Back Button */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3"
                        >
                            <div className="p-2 bg-orange-500 rounded-lg">
                                <Sparkles className="w-6 h-6 text-black" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                    AI Visualizer
                                </h1>
                                <p className="text-gray-500 text-sm">Visualize your logic step-by-step</p>
                            </div>
                        </motion.div>

                        <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ x: -5 }}
                            onClick={() => navigate('/home')}
                            className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors text-sm font-medium group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Dashboard
                        </motion.button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Panel: Inputs */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm"
                        >
                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-orange-400 flex items-center gap-2">
                                    Problem Statement
                                </label>
                                <textarea
                                    className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-orange-500/50 outline-none transition-all placeholder:text-gray-600 resize-none scrollbar-premium"
                                    placeholder="Paste the problem description here..."
                                    onChange={e => setProblem(e.target.value)}
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-orange-400 flex items-center gap-2">
                                    Constraints & Input Format
                                </label>
                                <textarea
                                    className="w-full h-20 bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-orange-500/50 outline-none transition-all placeholder:text-gray-600 resize-none scrollbar-premium"
                                    placeholder="E.g. 1 <= N <= 10^5..."
                                    onChange={e => setConstraints(e.target.value)}
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-orange-400 flex items-center gap-2">
                                    C++ Code
                                </label>
                                <textarea
                                    className="w-full h-64 bg-black/40 border border-white/10 rounded-xl p-3 text-sm font-mono focus:border-orange-500/50 outline-none transition-all placeholder:text-gray-600 resize-none scrollbar-premium"
                                    placeholder="// Paste your code here..."
                                    onChange={e => setCode(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-4 pt-2">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={validateCode}
                                    disabled={loading || !code || !problem}
                                    className="flex-1 px-6 py-3 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-orange-500 hover:text-white"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Validate Logic"}
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Right Panel: Results & Visualization */}
                        <div className="space-y-6">
                            <AnimatePresence mode="wait">
                                {validation ? (
                                    <motion.div
                                        key="validation-result"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className={`p-6 rounded-2xl border ${validation.isCorrect
                                            ? "bg-green-500/10 border-green-500/20"
                                            : "bg-red-500/10 border-red-500/20"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                {validation.isCorrect ? (
                                                    <CheckCircle className="w-6 h-6 text-green-500" />
                                                ) : (
                                                    <XCircle className="w-6 h-6 text-red-500" />
                                                )}
                                                <span className={`font-bold text-lg ${validation.isCorrect ? "text-green-500" : "text-red-500"
                                                    }`}>
                                                    {validation.isCorrect ? "Logic Verified" : "Issues Found"}
                                                </span>
                                            </div>
                                            <div className="text-xs px-2 py-1 bg-white/10 rounded-full font-mono text-gray-400">
                                                {validation.complexity?.time} | {validation.complexity?.space}
                                            </div>
                                        </div>

                                        {!validation.isCorrect && (
                                            <div className="space-y-4">
                                                <p className="text-sm text-gray-300"><b>Issue:</b> {validation.reason}</p>
                                                {validation.correctedCode && (
                                                    <div className="space-y-3">
                                                        <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider flex items-center gap-2">
                                                            <Sparkles className="w-3 h-3" />
                                                            Suggested Fix
                                                        </span>
                                                        <div className="relative group">
                                                            <pre className="bg-black/60 p-5 rounded-xl text-sm overflow-x-auto border border-white/10 font-mono text-gray-300 leading-relaxed max-h-[300px] scrollbar-premium">
                                                                {validation.correctedCode}
                                                            </pre>
                                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={handleCopy}
                                                                    className={`p-2 rounded-lg text-xs border border-white/10 transition-all flex items-center gap-2 ${isCopied
                                                                        ? "bg-green-500/20 text-green-500 border-green-500/50"
                                                                        : "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                                                                        }`}
                                                                >
                                                                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                                    {isCopied ? "Copied!" : "Copy"}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="mt-6 space-y-4">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-semibold text-gray-500 uppercase">Input for Visualization (JSON)</label>
                                                <input
                                                    type="text"
                                                    value={customInput}
                                                    onChange={e => setCustomInput(e.target.value)}
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm font-mono outline-none focus:border-orange-500/50"
                                                />
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={visualize}
                                                disabled={visualizing}
                                                className="w-full px-6 py-3 bg-orange-500 text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-orange-400 transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                                            >
                                                {visualizing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Play className="w-4 h-4 fill-current" /> Visualize Trace</>}
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="placeholder"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="h-full min-h-[400px] border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-gray-600 p-8 text-center"
                                    >
                                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                            <ChevronRight className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-400">Ready to start?</h3>
                                        <p className="max-w-xs mt-2">Paste your code and problem statement, then click validate to begin the visualization.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* VISUALIZATION CONTAINER */}
                            <AnimatePresence>
                                {trace && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md"
                                    >
                                        <ArrayVisualizer trace={trace} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
