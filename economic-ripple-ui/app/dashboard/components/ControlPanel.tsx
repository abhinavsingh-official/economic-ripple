"use client";

import { useSimulation } from "../hooks/useSimulation";
import { useSimulationStore } from "../store/simulationStore";

export function ControlPanel() {
  const { run } = useSimulation();
  const { isLoading, selectedCountries, selectedScenarioId, steps, setSteps } =
    useSimulationStore();

  const disabled = isLoading || selectedCountries.length === 0 || !selectedScenarioId;

  return (
    <div className="flex items-end gap-3">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-[#6B6560]">Steps</span>
        <input
          type="number"
          min={5}
          max={100}
          value={steps}
          onChange={(e) => setSteps(Math.max(5, Math.min(100, Number(e.target.value))))}
          className="h-10 w-20 rounded-xl border border-[#EDE9E4] bg-white px-3 text-sm text-[#1A1614] focus:border-[#E8541C] focus:outline-none focus:ring-2 focus:ring-[#E8541C]/20 transition-all"
        />
      </label>

      <button
        onClick={run}
        disabled={disabled}
        className="h-10 rounded-xl px-6 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: disabled
            ? "#EDE9E4"
            : "linear-gradient(135deg, #F97316 0%, #E8541C 100%)",
          color: disabled ? "#A09890" : "#fff",
          boxShadow: disabled ? "none" : "0 2px 12px rgba(232,84,28,0.35)",
        }}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Running…
          </span>
        ) : (
          "Run Simulation"
        )}
      </button>
    </div>
  );
}
