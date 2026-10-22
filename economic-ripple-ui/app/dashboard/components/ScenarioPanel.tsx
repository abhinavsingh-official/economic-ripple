"use client";

import { useSimulationStore } from "../store/simulationStore";

export function ScenarioPanel() {
  const { scenarios, selectedScenarioId, setSelectedScenarioId } =
    useSimulationStore();

  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-[#6B6560]">Scenario</span>
      <select
        className="h-10 rounded-xl border border-[#EDE9E4] bg-white px-3 text-sm text-[#1A1614] focus:border-[#E8541C] focus:outline-none focus:ring-2 focus:ring-[#E8541C]/20 transition-all"
        value={selectedScenarioId}
        onChange={(e) => setSelectedScenarioId(e.target.value)}
      >
        {scenarios.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
    </label>
  );
}
