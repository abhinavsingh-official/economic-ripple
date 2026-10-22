"use client";

import { useSimulationStore } from "../store/simulationStore";
import { ChartCard } from "./ChartCard";
import { EconomicLineChart } from "./charts/EconomicLineChart";
import { PovertyAreaChart } from "./charts/PovertyAreaChart";
import { EconomicRadarChart } from "./charts/EconomicRadarChart";
import { ScatterGdpInflation } from "./charts/ScatterGdpInflation";
import { CountrySnapshotBar } from "./charts/CountrySnapshotBar";
import { ShockAttributionChart } from "./charts/ShockAttributionChart";
import { VariableHeatmap } from "./charts/VariableHeatmap";
import { WellbeingAreaChart } from "./charts/WellbeingAreaChart";

export function DashboardGrid() {
  const { result, viewStep } = useSimulationStore();

  if (!result) {
    return (
      <div
        className="col-span-3 flex flex-col items-center justify-center gap-4 bg-white rounded-xl border border-[#EDE9E4]"
        style={{ minHeight: 340 }}
      >
        <div className="w-14 h-14 rounded-2xl bg-[#FFF3EE] flex items-center justify-center">
          <svg className="w-7 h-7 text-[#E8541C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div className="text-center">
          <div className="text-base font-semibold text-[#344054]">Ready to simulate</div>
          <div className="text-sm text-[#A09890] max-w-xs mt-1">
            Select countries on the left, pick a scenario, and hit Run Simulation.
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Row 1 — Economic line chart (2/3) | Radar (1/3) */}
      <ChartCard
        title="Economic Indicators"
        subtitle="GDP growth, inflation & unemployment — toggle variable above"
        className="col-span-2"
        style={{ minHeight: 260 }}
      >
        <div style={{ height: 210 }} className="flex flex-col">
          <EconomicLineChart />
        </div>
      </ChartCard>
      <ChartCard
        title="Economic Profile"
        subtitle={`Normalised · Step ${viewStep}`}
        style={{ minHeight: 260 }}
      >
        <div style={{ height: 200 }}>
          <EconomicRadarChart />
        </div>
      </ChartCard>

      {/* Row 2 — Country Snapshot (2/3) | Scatter (1/3) */}
      <ChartCard
        title="Country Snapshot"
        subtitle={`All variables · Step ${viewStep}`}
        className="col-span-2"
        style={{ minHeight: 240 }}
      >
        <div style={{ height: 180 }}>
          <CountrySnapshotBar />
        </div>
      </ChartCard>
      <ChartCard
        title="GDP vs Inflation"
        subtitle={`Phillips scatter · Step ${viewStep}`}
        style={{ minHeight: 240 }}
      >
        <div style={{ height: 180 }}>
          <ScatterGdpInflation />
        </div>
      </ChartCard>

      {/* Row 4 — Poverty area (full width) */}
      <ChartCard
        title="Poverty Rate"
        subtitle={`Area spread · all countries · ${result.steps} steps`}
        className="col-span-3"
        style={{ minHeight: 190 }}
      >
        <div style={{ height: 140 }}>
          <PovertyAreaChart />
        </div>
      </ChartCard>

      {/* Row 5 — Wellbeing (2/3) | Shock Attribution (1/3) */}
      <ChartCard
        title="Wellbeing Variables"
        subtitle="Mental health, urbanization & crime — toggle variable above"
        className="col-span-2"
        style={{ minHeight: 260 }}
      >
        <div style={{ height: 210 }} className="flex flex-col">
          <WellbeingAreaChart />
        </div>
      </ChartCard>

      <ChartCard
        title="Shock Attribution"
        subtitle={`System vs shock vs noise · avg · Step ${viewStep}`}
        style={{ minHeight: 260 }}
      >
        <div style={{ height: 220 }}>
          <ShockAttributionChart />
        </div>
      </ChartCard>

      {/* Row 6 — Heatmap (full width) */}
      <ChartCard
        title="Variable Heatmap"
        subtitle={`All countries × all variables · Step ${viewStep} · colour = intensity`}
        className="col-span-3"
      >
        <VariableHeatmap />
      </ChartCard>
    </>
  );
}
