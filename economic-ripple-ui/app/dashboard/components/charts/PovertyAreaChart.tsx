"use client";

import { useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { useSimulationStore } from "../../store/simulationStore";
import { COUNTRY_LINE_COLORS } from "@/lib/constants";
import { pivotByStep } from "../../utils/chartHelpers";
import { ChartEmptyState } from "../ChartCard";

export function PovertyAreaChart() {
  const { result, selectedCountries, viewStep } = useSimulationStore();

  const data = useMemo(
    () => (result ? pivotByStep(result.data, selectedCountries, "poverty_rate") : []),
    [result, selectedCountries]
  );

  if (!result || data.length === 0) return <ChartEmptyState />;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 2, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F5F0EC" vertical={false} />
        <XAxis dataKey="step" tick={{ fontSize: 10, fill: "#A09890" }} axisLine={{ stroke: "#EDE9E4" }} tickLine={false} tickFormatter={(v) => `t${v}`} />
        <YAxis tick={{ fontSize: 10, fill: "#A09890" }} axisLine={false} tickLine={false} width={40} tickFormatter={(v) => v.toFixed(2)} />
        <Tooltip
          contentStyle={{ border: "1px solid #EDE9E4", borderRadius: 8, fontSize: 11, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}
          formatter={(v, name) => [typeof v === "number" ? v.toFixed(4) : v, String(name)]}
          labelFormatter={(l) => `Step ${l}`}
        />
        <ReferenceLine x={viewStep} stroke="#E8541C" strokeDasharray="4 3" strokeWidth={1.5} strokeOpacity={0.6} />
        {selectedCountries.map((code, i) => (
          <Area
            key={code}
            type="monotone"
            dataKey={code}
            stroke={COUNTRY_LINE_COLORS[i % COUNTRY_LINE_COLORS.length]}
            fill={COUNTRY_LINE_COLORS[i % COUNTRY_LINE_COLORS.length]}
            fillOpacity={0.1}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3, strokeWidth: 0 }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
