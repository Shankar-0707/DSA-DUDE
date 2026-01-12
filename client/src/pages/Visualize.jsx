import { useState } from "react";
import ArrayVisualizer from "../visualizers/ArrayVisualizer";
import API from "@/api/api";

export default function Visualize() {
    const [problem, setProblem] = useState("");
    const [constraints, setConstraints] = useState("");
    const [code, setCode] = useState("");

    const [validation, setValidation] = useState(null);
    const [trace, setTrace] = useState(null);
    const [loading, setLoading] = useState(false);

    const validateCode = async () => {
        setLoading(true);
        setTrace(null);

        const res = await API.post(
            "/visualize/validate",
            { problem, constraints, code }
        );

        setValidation(res.data);
        setLoading(false);
    };

    const visualize = async () => {
        const finalCode = validation.correctedCode || code;

        const res = await API.post(
            "/visualize/trace",
            {
                code: finalCode,
                input: [1, -1, 2, 3]
            }
        );

        setTrace(res.data);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-4">
            {/* INPUTS */}
            <textarea
                className="w-full h-24 border p-2"
                placeholder="Paste Problem Statement"
                onChange={e => setProblem(e.target.value)}
            />

            <textarea
                className="w-full h-20 border p-2"
                placeholder="Paste Constraints"
                onChange={e => setConstraints(e.target.value)}
            />

            <textarea
                className="w-full h-40 border p-2 font-mono"
                placeholder="Paste Your C++ Code"
                onChange={e => setCode(e.target.value)}
            />

            {/* VALIDATE BUTTON */}
            <button
                onClick={validateCode}
                disabled={loading}
                className="px-4 py-2 bg-black text-white"
            >
                {loading ? "Validating..." : "Validate"}
            </button>

            {/* VALIDATION RESULT */}
            {validation && (
                <div className="border p-4 space-y-3">
                    <div
                        className={`font-bold ${validation.isCorrect ? "text-green-600" : "text-red-600"
                            }`}
                    >
                        {validation.isCorrect ? "✔ Code is Correct" : "✖ Code is Incorrect"}
                    </div>

                    {!validation.isCorrect && (
                        <>
                            <div className="text-sm text-gray-700">
                                <b>Reason:</b> {validation.reason}
                            </div>

                            <div>
                                <div className="font-semibold mb-1">Corrected Code:</div>
                                <pre className="bg-gray-100 p-3 text-sm overflow-x-auto">
                                    {validation.correctedCode}
                                </pre>
                            </div>
                        </>
                    )}

                    {/* VISUALIZE BUTTON */}
                    <button
                        onClick={visualize}
                        className="px-4 py-2 bg-blue-600 text-white"
                    >
                        Visualize
                    </button>
                </div>
            )}

            {/* VISUALIZATION */}
            {trace && <ArrayVisualizer trace={trace} />}
        </div>
    );
}
