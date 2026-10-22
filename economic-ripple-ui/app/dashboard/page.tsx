"use client";

import { useState } from "react";
import { useCountries } from "./hooks/useCountries";
import { useInsights } from "./hooks/useInsights";
import { useSimulation } from "./hooks/useSimulation";
import { usePlayback } from "./hooks/usePlayback";
import { useAutoRun } from "./hooks/useAutoRun";
import { useSimulationStore } from "./store/simulationStore";
import { TopBar } from "./components/TopBar";
import { LeftPanel } from "./components/LeftPanel";
import { DashboardGrid } from "./components/DashboardGrid";
import { CountryIntelligencePanel } from "./components/CountryIntelligencePanel";
import { InsightsPanel } from "./components/InsightsPanel";

type Tab = "charts" | "insights";

export default function DashboardPage() {
  useCountries();
  useInsights();
  usePlayback();

  const { run } = useSimulation();
  useAutoRun(run);

  const [activeTab, setActiveTab] = useState<Tab>("charts");

  const {
    result,
    viewStep,
    setViewStep,
    isPlaying,
    setIsPlaying,
    setResult,
  } = useSimulationStore();

  const maxStep = result ? result.steps - 1 : 0;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">

      {/* Top control bar */}
      <TopBar />

      {/* Body: left panel + right column */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left panel: countries + shocks */}
        <LeftPanel />

        {/* Right column: charts + time controls + country intel */}
        <div className="flex flex-col flex-1 overflow-hidden">

          {/* Tab bar */}
          <div className="shrink-0 border-b border-[#EDE9E4] bg-white px-5 flex items-center gap-0">
            {(["charts", "insights"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === tab
                    ? "border-[#E8541C] text-[#E8541C]"
                    : "border-transparent text-[#A09890] hover:text-[#6B6560]"
                }`}
              >
                {tab === "charts" ? "Charts" : "Insights & Methodology"}
              </button>
            ))}
          </div>

          {/* Main content: Charts grid OR Insights panel */}
          {activeTab === "charts" ? (
            <div className="flex-1 overflow-y-auto p-4 bg-[#FAF8F6]">
              <div
                className="grid gap-3"
                style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
              >
                <DashboardGrid />
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 bg-[#FAF8F6]">
              <InsightsPanel />
            </div>
          )}

          {/* Time scrubber — only on charts tab */}
          {activeTab === "charts" && (
          <div className="shrink-0 bg-white border-t border-[#EDE9E4] px-5 py-2.5 flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={!result}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#EDE9E4] text-[#6B6560] hover:border-[#E8541C] hover:text-[#E8541C] transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              {isPlaying ? (
                <>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Pause
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Play
                </>
              )}
            </button>

            <button
              onClick={() => { setIsPlaying(false); setViewStep(0); }}
              disabled={!result}
              title="Reset to start"
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#EDE9E4] text-[#6B6560] hover:border-[#A09890] transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              ↩
            </button>

            <div className="flex-1 flex items-center gap-2.5">
              <span className="text-xs text-[#A09890] shrink-0 font-mono w-10 text-right">
                t = {viewStep}
              </span>
              <input
                type="range"
                min={0}
                max={maxStep}
                value={viewStep}
                disabled={!result}
                onChange={(e) => {
                  setIsPlaying(false);
                  setViewStep(Number(e.target.value));
                }}
                className="flex-1 h-1 rounded-full appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ accentColor: "#E8541C" }}
              />
              <span className="text-xs text-[#A09890] shrink-0 font-mono">{maxStep}</span>
            </div>

            {result && (
              <button
                onClick={() => { setResult(null); setViewStep(0); setIsPlaying(false); }}
                className="text-xs text-[#A09890] hover:text-[#DC2626] transition-colors shrink-0 font-medium"
              >
                Clear
              </button>
            )}
          </div>
          )}

          {/* Country intelligence panel */}
          <CountryIntelligencePanel />
        </div>
      </div>
    </div>
  );
}
