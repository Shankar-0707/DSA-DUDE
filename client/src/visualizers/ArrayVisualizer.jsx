import { useState } from "react";

export default function ArrayVisualizer({ trace }) {
  const [step, setStep] = useState(0);
  const current = trace.steps[step];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {trace.input.map((val, idx) => (
          <div
            key={idx}
            className={`w-12 h-12 flex items-center justify-center border
              ${idx === current.i ? "bg-yellow-300" : ""}`}
          >
            {val}
          </div>
        ))}
      </div>

      <div className="text-lg">
        Prefix Sum = <b>{current.prefixSum}</b>
      </div>

      <button
        disabled={step === trace.steps.length - 1}
        onClick={() => setStep(step + 1)}
        className="px-3 py-1 border"
      >
        Next Step
      </button>
    </div>
  );
}
