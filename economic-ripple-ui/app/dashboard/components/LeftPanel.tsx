"use client";

import { useSimulationStore } from "../store/simulationStore";
import { COUNTRY_LINE_COLORS, SHOCK_VARIABLES } from "@/lib/constants";

export function LeftPanel() {
  const {
    countries,
    selectedCountries,
    toggleCountry,
    manualShocks,
    setManualShock,
  } = useSimulationStore();

  function resetShocks() {
    SHOCK_VARIABLES.forEach(({ key }) => setManualShock(key, 0));
  }

  const hasShocks = SHOCK_VARIABLES.some(({ key }) => (manualShocks[key] ?? 0) !== 0);

  return (
    <div
      className="flex flex-col overflow-y-auto bg-white border-r border-[#EDE9E4] shrink-0"
      style={{ width: 248 }}
    >
      {/* Countries section */}
      <div className="p-4 border-b border-[#EDE9E4]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#A09890]">
            Countries
          </span>
          <span className="text-xs font-semibold text-[#E8541C]">
            {selectedCountries.length} selected
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          {countries.map((country) => {
            const isSelected = selectedCountries.includes(country.code);
            const colorIdx = selectedCountries.indexOf(country.code);
            const color =
              colorIdx >= 0
                ? COUNTRY_LINE_COLORS[colorIdx % COUNTRY_LINE_COLORS.length]
                : "#D0D5DD";

            return (
              <button
                key={country.code}
                onClick={() => toggleCountry(country.code)}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm text-left transition-all hover:bg-[#FAF8F6] w-full"
                style={{ color: isSelected ? color : "#6B6560" }}
              >
                {/* Checkbox */}
                <span
                  className="w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border transition-all"
                  style={{
                    borderColor: isSelected ? color : "#D0D5DD",
                    backgroundColor: isSelected ? color : "white",
                  }}
                >
                  {isSelected && (
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path
                        d="M1 3L3 5L7 1"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span className={isSelected ? "font-semibold" : "font-normal"}>
                  {country.name}
                </span>
                {isSelected && (
                  <span
                    className="ml-auto text-[10px] font-bold tabular-nums"
                    style={{ color }}
                  >
                    {colorIdx + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Manual shocks section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#A09890]">
            Manual Shocks
          </span>
          {hasShocks && (
            <button
              onClick={resetShocks}
              className="text-[10px] text-[#A09890] hover:text-[#E8541C] transition-colors font-medium"
            >
              Reset
            </button>
          )}
        </div>

        <div className="flex flex-col gap-5">
          {SHOCK_VARIABLES.map(({ key, label }) => {
            const val = manualShocks[key] ?? 0;
            return (
              <div key={key}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-[#6B6560]">{label}</span>
                  <span
                    className="text-xs font-bold font-mono"
                    style={{
                      color:
                        val > 0 ? "#16A34A" : val < 0 ? "#DC2626" : "#A09890",
                    }}
                  >
                    {val > 0 ? "+" : ""}
                    {val.toFixed(2)}
                  </span>
                </div>

                <input
                  type="range"
                  min={-1}
                  max={1}
                  step={0.05}
                  value={val}
                  onChange={(e) => setManualShock(key, parseFloat(e.target.value))}
                  className="w-full cursor-pointer h-1.5 rounded-full"
                  style={{ accentColor: val >= 0 ? "#16A34A" : "#DC2626" }}
                />

                <div className="flex justify-between text-[10px] text-[#C4BBB4] mt-1">
                  <span>−1.0</span>
                  <span>0</span>
                  <span>+1.0</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-[#F5F0EC]">
          <p className="text-[10px] text-[#C4BBB4] leading-relaxed">
            Shocks override the scenario baseline for the next run. Drag left for negative impact,
            right for positive.
          </p>
        </div>
      </div>
    </div>
  );
}
