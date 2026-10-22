"use client";

import { useMemo } from "react";
import { useSimulationStore } from "../store/simulationStore";
import { COUNTRY_LINE_COLORS, ALL_VARIABLES, VARIABLE_LABELS, VARIABLE_COLORS } from "@/lib/constants";

function DeltaBadge({ delta }: { delta: number }) {
  const pos = delta > 0.0001;
  const neg = delta < -0.0001;
  return (
    <span
      className="inline-flex items-center gap-0.5 text-[9px] font-semibold px-1 py-0.5 rounded"
      style={{
        backgroundColor: pos ? "#F0FDF4" : neg ? "#FEF2F2" : "#FAF8F6",
        color: pos ? "#16A34A" : neg ? "#DC2626" : "#A09890",
      }}
    >
      {pos ? "▲" : neg ? "▼" : "—"}
      {Math.abs(delta).toFixed(3)}
    </span>
  );
}

export function CountryIntelligencePanel() {
  const { result, selectedCountries, viewStep } = useSimulationStore();

  const cards = useMemo(() => {
    if (!result || selectedCountries.length === 0) return [];
    return selectedCountries.map((code, i) => {
      const rows = result.data.filter((r) => r.country === code);
      const baseline = rows[0];
      const atStep = rows.find((r) => r.step === viewStep) ?? rows.at(-1);
      const variables = ALL_VARIABLES.map((key) => ({
        key,
        label: VARIABLE_LABELS[key] ?? key,
        color: VARIABLE_COLORS[key],
        val: (atStep?.[key] as number) ?? 0,
        delta: ((atStep?.[key] as number) ?? 0) - ((baseline?.[key] as number) ?? 0),
      }));
      return {
        code,
        color: COUNTRY_LINE_COLORS[i % COUNTRY_LINE_COLORS.length],
        variables,
      };
    });
  }, [result, selectedCountries, viewStep]);

  return (
    <div className="shrink-0 border-t border-[#EDE9E4] bg-white px-5 py-3">
      <div className="flex items-center gap-3 mb-2.5">
        <span className="text-xs font-bold uppercase tracking-widest text-[#A09890]">
          Country Intelligence
        </span>
        {result && (
          <span className="text-xs text-[#C4BBB4]">
            Step {viewStep} / {result.steps - 1} · Δ from baseline
          </span>
        )}
      </div>

      {cards.length === 0 ? (
        <div className="text-sm text-[#C4BBB4]">
          {result ? "No countries selected" : "Run a simulation to see per-country breakdown"}
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {cards.map((c) => (
            <div
              key={c.code}
              className="shrink-0 rounded-xl border p-3.5"
              style={{
                borderColor: `${c.color}40`,
                backgroundColor: `${c.color}07`,
                minWidth: 260,
              }}
            >
              {/* Country name */}
              <div
                className="text-sm font-bold mb-3 flex items-center gap-1.5"
                style={{ color: c.color }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                {c.code}
              </div>

              {/* 7-variable grid */}
              <div className="grid grid-cols-4 gap-x-3 gap-y-2.5">
                {c.variables.map(({ key, label, color, val, delta }) => (
                  <div key={key}>
                    <div
                      className="text-[9px] uppercase tracking-wide font-semibold mb-0.5"
                      style={{ color }}
                    >
                      {label}
                    </div>
                    <div className="text-xs font-bold text-[#1A1614]">{val.toFixed(2)}</div>
                    <DeltaBadge delta={delta} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
