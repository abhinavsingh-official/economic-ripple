"use client";

import React, { useMemo } from "react";
import { useSimulationStore } from "../../store/simulationStore";
import { VARIABLE_LABELS, VARIABLE_COLORS, ALL_VARIABLES, VARIABLE_BOUNDS } from "@/lib/constants";
import { ChartEmptyState } from "../ChartCard";

function hexWithOpacity(hex: string, opacity: number): string {
  const alpha = Math.round(Math.max(0, Math.min(1, opacity)) * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex}${alpha}`;
}

export function VariableHeatmap() {
  const { result, selectedCountries, viewStep } = useSimulationStore();

  const cells = useMemo(() => {
    if (!result || selectedCountries.length === 0) return null;
    return selectedCountries.map((code) => {
      const row =
        result.data.find((r) => r.country === code && r.step === viewStep) ??
        result.data.filter((r) => r.country === code).at(-1);
      return { code, row };
    });
  }, [result, selectedCountries, viewStep]);

  if (!result || !cells) return <ChartEmptyState />;

  return (
    <div className="overflow-x-auto">
      <div
        className="min-w-max"
        style={{ display: "grid", gridTemplateColumns: `100px repeat(${ALL_VARIABLES.length}, 1fr)` }}
      >
        {/* Header */}
        <div className="p-2" />
        {ALL_VARIABLES.map((key) => (
          <div
            key={key}
            className="p-2 text-center"
            style={{
              borderBottom: "1px solid #EDE9E4",
              borderLeft: "1px solid #EDE9E4",
            }}
          >
            <div
              className="text-[9px] font-bold uppercase tracking-wide"
              style={{ color: VARIABLE_COLORS[key] }}
            >
              {VARIABLE_LABELS[key]}
            </div>
          </div>
        ))}

        {/* Rows */}
        {cells.map(({ code, row }) => (
          <React.Fragment key={code}>
            <div
              className="p-2 flex items-center text-xs font-semibold text-[#1A1614]"
              style={{ borderTop: "1px solid #EDE9E4" }}
            >
              {code}
            </div>
            {ALL_VARIABLES.map((key) => {
              const val = row ? (row[key] as number) : 0;
              const [min, max] = VARIABLE_BOUNDS[key];
              const intensity = Math.max(0, Math.min(1, (val - min) / (max - min)));
              const bgColor = hexWithOpacity(VARIABLE_COLORS[key], intensity * 0.65 + 0.08);
              return (
                <div
                  key={`${code}-${key}`}
                  className="p-2 text-center transition-colors duration-200"
                  style={{
                    backgroundColor: bgColor,
                    borderTop: "1px solid #EDE9E4",
                    borderLeft: "1px solid #EDE9E4",
                  }}
                  title={`${code} — ${VARIABLE_LABELS[key]}: ${val.toFixed(4)}`}
                >
                  <div className="text-[10px] font-mono font-semibold text-[#1A1614]">
                    {val.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
