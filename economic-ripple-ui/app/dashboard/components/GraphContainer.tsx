"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useSimulationStore } from "../store/simulationStore";
import { VARIABLE_LABELS, VARIABLE_COLORS } from "@/lib/constants";

const DEFAULT_ACTIVE = ["gdp_growth", "inflation", "unemployment_rate", "poverty_rate"];

export function GraphContainer() {
  const { result, selectedCountries } = useSimulationStore();
  const primaryCountry = selectedCountries[0] ?? "";
  const [activeVars, setActiveVars] = useState<string[]>(DEFAULT_ACTIVE);

  const chartData = useMemo(() => {
    if (!result || !primaryCountry) return [];
    return result.data
      .filter((row) => row.country === primaryCountry)
      .map((row) => {
        const point: Record<string, number> = { step: row.step };
        Object.keys(VARIABLE_LABELS).forEach((key) => {
          point[key] = +(row[key] as number).toFixed(4);
        });
        return point;
      });
  }, [result, primaryCountry]);

  function toggleVar(key: string) {
    setActiveVars((prev) =>
      prev.includes(key) ? prev.filter((v) => v !== key) : [...prev, key]
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#EDE9E4] p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-4">
        <div>
          <div className="text-sm font-semibold text-[#1A1614]">Simulation Output</div>
          <div className="text-xs text-[#6B6560] mt-0.5">
            {result
              ? `${result.steps} steps · ${primaryCountry} · ${result.scenario ?? "no scenario"}`
              : "Economic variable propagation over time"}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(VARIABLE_LABELS).map(([key, label]) => {
            const active = activeVars.includes(key);
            return (
              <button
                key={key}
                onClick={() => toggleVar(key)}
                className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all"
                style={{
                  borderColor: active ? VARIABLE_COLORS[key] : "#EDE9E4",
                  color: active ? VARIABLE_COLORS[key] : "#98A2B3",
                  backgroundColor: active ? `${VARIABLE_COLORS[key]}12` : "transparent",
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: active ? VARIABLE_COLORS[key] : "#D0D5DD" }}
                />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData} margin={{ top: 4, right: 16, bottom: 4, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F2F4F7" />
            <XAxis
              dataKey="step"
              tick={{ fontSize: 11, fill: "#98A2B3" }}
              axisLine={{ stroke: "#EDE9E4" }}
              tickLine={false}
              label={{ value: "Step", position: "insideBottom", offset: -2, fontSize: 11, fill: "#98A2B3" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#98A2B3" }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip
              contentStyle={{
                border: "1px solid #EDE9E4",
                borderRadius: "8px",
                fontSize: "12px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              }}
              formatter={(value, name) => [
                typeof value === "number" ? value.toFixed(4) : String(value ?? ""),
                VARIABLE_LABELS[String(name)] ?? String(name ?? ""),
              ]}
            />
            <Legend
              formatter={(value) => (
                <span style={{ fontSize: 11, color: "#667085" }}>
                  {VARIABLE_LABELS[value] ?? value}
                </span>
              )}
            />
            {Object.keys(VARIABLE_LABELS).map((key) =>
              activeVars.includes(key) ? (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={VARIABLE_COLORS[key]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
              ) : null
            )}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[320px] flex flex-col items-center justify-center text-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF3EE] flex items-center justify-center">
            <svg className="w-6 h-6 text-[#E8541C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-[#344054]">No simulation data yet</div>
            <div className="text-xs text-[#98A2B3] mt-1">
              Select a country and scenario above, then run
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
