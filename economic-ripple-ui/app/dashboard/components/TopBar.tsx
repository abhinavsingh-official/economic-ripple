"use client";

import { useSimulation } from "../hooks/useSimulation";
import { useSimulationStore } from "../store/simulationStore";
import { generateHtmlReport } from "../utils/reportGenerator";

export function TopBar() {
  const { run } = useSimulation();
  const {
    scenarios,
    selectedScenarioId,
    setSelectedScenarioId,
    steps,
    setSteps,
    isLoading,
    selectedCountries,
    manualShocks,
    result,
    error,
  } = useSimulationStore();

  const handleExportReport = () => {
    if (!result) return;
    const html = generateHtmlReport({ result, selectedCountries, selectedScenarioId, steps, manualShocks });
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `economic-ripple-${selectedScenarioId}-report.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const canRun = !isLoading && selectedCountries.length > 0 && !!selectedScenarioId;
  const hasCustomShocks = Object.values(manualShocks).some((v) => v !== 0);

  return (
    <div className="bg-white border-b border-[#EDE9E4] px-5 py-3 shrink-0">
      <div className="flex flex-wrap items-center gap-3">

        {/* Scenario selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#A09890] font-semibold uppercase tracking-wide">Scenario</span>
          <select
            value={selectedScenarioId}
            onChange={(e) => setSelectedScenarioId(e.target.value)}
            className="h-8 rounded-lg border border-[#EDE9E4] bg-white px-2.5 text-sm text-[#1A1614] focus:border-[#E8541C] focus:outline-none transition-all"
          >
            {scenarios.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          {hasCustomShocks && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF3EE] border border-[#FDDCC7] text-[#E8541C]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8541C]" />
              Custom
            </span>
          )}
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#A09890] font-semibold uppercase tracking-wide">Steps</span>
          <input
            type="number"
            min={5}
            max={100}
            value={steps}
            onChange={(e) => setSteps(Math.max(5, Math.min(100, Number(e.target.value))))}
            className="h-8 w-16 rounded-lg border border-[#EDE9E4] bg-white px-2.5 text-sm text-[#1A1614] focus:border-[#E8541C] focus:outline-none transition-all"
          />
        </div>

        <div className="h-5 w-px bg-[#EDE9E4]" />

        {/* Run button */}
        <button
          onClick={run}
          disabled={!canRun}
          className="h-8 rounded-lg px-5 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
          style={{
            background: !canRun ? "#EDE9E4" : "linear-gradient(135deg, #F97316 0%, #E8541C 100%)",
            color: !canRun ? "#A09890" : "#fff",
            boxShadow: !canRun ? "none" : "0 2px 10px rgba(232,84,28,0.30)",
          }}
        >
          {isLoading ? (
            <>
              <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Running…
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              Run Simulation
            </>
          )}
        </button>

        {/* Export report */}
        {result && (
          <button
            onClick={handleExportReport}
            className="h-8 rounded-lg px-4 text-sm font-semibold border border-[#EDE9E4] text-[#6B6560] hover:border-[#E8541C] hover:text-[#E8541C] transition-all flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Report
          </button>
        )}

        {/* Error */}
        {error && (
          <div className="ml-auto flex items-center gap-1.5 rounded-full bg-[#FEF2F2] border border-[#FECACA] px-3 py-1 text-xs font-medium text-[#DC2626]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#DC2626]" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
