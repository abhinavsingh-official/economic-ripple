"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useSimulationStore } from "../store/simulationStore";
import { COUNTRY_LINE_COLORS } from "@/lib/constants";

type VariableChartProps = {
  variableKey: string;
  label: string;
  height?: number;
};

export function VariableChart({ variableKey, label, height = 190 }: VariableChartProps) {
  const { result, selectedCountries, viewStep } = useSimulationStore();

  const chartData = useMemo(() => {
    if (!result || selectedCountries.length === 0) return [];
    const stepMap = new Map<number, Record<string, number>>();
    result.data
      .filter((row) => selectedCountries.includes(row.country as string))
      .forEach((row) => {
        const s = row.step;
        if (!stepMap.has(s)) stepMap.set(s, { step: s });
        stepMap.get(s)![row.country as string] = +(row[variableKey] as number).toFixed(4);
      });
    return Array.from(stepMap.values()).sort((a, b) => a.step - b.step);
  }, [result, selectedCountries, variableKey]);

  return (
    <div className="bg-white rounded-xl border border-[#EDE9E4] p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-[#1A1614]">{label}</span>
        {selectedCountries.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {selectedCountries.map((code, i) => (
              <span
                key={code}
                className="flex items-center gap-1.5 text-[11px] font-medium"
                style={{ color: COUNTRY_LINE_COLORS[i % COUNTRY_LINE_COLORS.length] }}
              >
                <span
                  className="inline-block h-0.5 w-4 rounded-full"
                  style={{ backgroundColor: COUNTRY_LINE_COLORS[i % COUNTRY_LINE_COLORS.length] }}
                />
                {code}
              </span>
            ))}
          </div>
        )}
      </div>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={chartData} margin={{ top: 2, right: 8, bottom: 2, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5F0EC" vertical={false} />
            <XAxis
              dataKey="step"
              tick={{ fontSize: 10, fill: "#A09890" }}
              axisLine={{ stroke: "#EDE9E4" }}
              tickLine={false}
              tickFormatter={(v) => `t${v}`}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#A09890" }}
              axisLine={false}
              tickLine={false}
              width={42}
              tickFormatter={(v) => v.toFixed(2)}
            />
            <Tooltip
              contentStyle={{
                border: "1px solid #EDE9E4",
                borderRadius: "8px",
                fontSize: "11px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                backgroundColor: "white",
              }}
              formatter={(value, name) => [
                typeof value === "number" ? value.toFixed(4) : String(value ?? ""),
                String(name ?? ""),
              ]}
              labelFormatter={(label) => `Step ${label}`}
            />
            {result && (
              <ReferenceLine
                x={viewStep}
                stroke="#E8541C"
                strokeDasharray="4 3"
                strokeWidth={1.5}
                strokeOpacity={0.6}
              />
            )}
            {selectedCountries.map((code, i) => (
              <Line
                key={code}
                type="monotone"
                dataKey={code}
                stroke={COUNTRY_LINE_COLORS[i % COUNTRY_LINE_COLORS.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div
          className="flex flex-col items-center justify-center text-center gap-2"
          style={{ height }}
        >
          <div className="w-9 h-9 rounded-xl bg-[#FFF3EE] flex items-center justify-center">
            <svg className="w-4 h-4 text-[#E8541C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 12l3-3 3 3 4-4M3 4h18"
              />
            </svg>
          </div>
          <div className="text-xs text-[#A09890]">
            {selectedCountries.length === 0
              ? "Select at least one country"
              : "Run simulation to populate chart"}
          </div>
        </div>
      )}
    </div>
  );
}
