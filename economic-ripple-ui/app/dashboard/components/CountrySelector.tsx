"use client";

import { useSimulationStore } from "../store/simulationStore";

export function CountrySelector() {
  const { countries, selectedCountries, toggleCountry } = useSimulationStore();

  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-[#6B6560]">Country</span>
      <select
        className="h-10 rounded-xl border border-[#EDE9E4] bg-white px-3 text-sm text-[#1A1614] focus:border-[#E8541C] focus:outline-none focus:ring-2 focus:ring-[#E8541C]/20 transition-all"
        value={selectedCountries[0] ?? ""}
        onChange={(e) => toggleCountry(e.target.value)}
      >
        {countries.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name}
          </option>
        ))}
      </select>
    </label>
  );
}
