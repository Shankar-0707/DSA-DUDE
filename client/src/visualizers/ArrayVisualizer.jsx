import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";

const forceArray = (item) => {
    if (Array.isArray(item)) return item;
    if (item && typeof item === 'object') return Object.values(item);
    return [];
};

export default function ArrayVisualizer({ trace }) {
    const [stepIdx, setStepIdx] = useState(0);
    const steps = trace.steps || [];
    const currentStep = steps[stepIdx] || {};
    const { state = {}, explanation = "", i: flatI, j: flatJ } = currentStep;

    const activeI = state.i !== undefined ? state.i : (flatI !== undefined ? flatI : -1);
    const activeJ = state.j !== undefined ? state.j : (flatJ !== undefined ? flatJ : -1);

    useEffect(() => {
        setStepIdx(0);
    }, [trace]);

    const displayArray = forceArray(state.resultState || trace.input);

    const nextStep = () => setStepIdx(prev => Math.min(prev + 1, steps.length - 1));

    return (
        <div className="space-y-8">
            {/* Array Display */}
            <div className="flex flex-wrap gap-3 justify-center py-8">
                <AnimatePresence mode="popLayout">
                    {displayArray && displayArray.length > 0 ? displayArray.map((val, idx) => {
                        const isI = idx === activeI;
                        const isJ = idx === activeJ;

                        return (
                            <motion.div
                                key={`${idx}-${val}`}
                                layout
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{
                                    scale: (isI || isJ) ? 1.1 : 1,
                                    opacity: 1,
                                    backgroundColor: isI ? "#f97316" : isJ ? "#3b82f6" : "#171717",
                                    borderColor: (isI || isJ) ? "#f97316" : "#262626"
                                }}
                                className="w-14 h-14 flex flex-col items-center justify-center border-2 rounded-xl font-mono font-bold shadow-lg relative group"
                            >
                                <span className="text-white text-lg">{val}</span>
                                <span className="text-[10px] text-gray-500 absolute -bottom-6 font-mono">
                                    {idx}
                                </span>
                                {(isI || isJ) && (
                                    <motion.div
                                        initial={{ y: 5, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="absolute -top-6 text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-black/50 border border-white/10"
                                        style={{ color: isI ? "#f97316" : "#3b82f6" }}
                                    >
                                        {isI ? "i" : "j"}
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    }) : null}
                </AnimatePresence>
            </div>

            {/* Explanation Card */}
            <motion.div
                key={stepIdx}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-black/40 border border-white/10 p-5 rounded-2xl flex gap-4 items-start"
            >
                <div className="p-2 bg-orange-500/10 rounded-lg shrink-0">
                    <Info className="w-5 h-5 text-orange-400" />
                </div>
                <div className="space-y-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Step {stepIdx + 1} of {steps.length}</span>
                    <p className="text-gray-200 leading-relaxed italic">
                        "{explanation}"
                    </p>
                </div>
            </motion.div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-4 pt-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => setStepIdx(0)}
                        className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                    >
                        Reset
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setStepIdx(prev => Math.max(0, prev - 1))}
                        disabled={stepIdx === 0}
                        className="p-3 bg-white/5 border border-white/10 rounded-full disabled:opacity-20 hover:bg-white/10 transition-all"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </motion.button>

                    <div className="flex gap-1">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === stepIdx ? "bg-orange-500 w-4" : "bg-white/10"}`}
                            />
                        ))}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={nextStep}
                        disabled={stepIdx === steps.length - 1}
                        className="p-3 bg-white/5 border border-white/10 rounded-full disabled:opacity-20 hover:bg-white/10 transition-all text-orange-500"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </motion.button>
                </div>

                <div className="text-xs font-mono text-gray-600">
                    {trace.meta?.problemType}
                </div>
            </div>
        </div>
    );
}