"use client";

import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { useSimulationStore } from "../../store/simulationStore";
import { buildShockAttribution } from "../../utils/chartHelpers";
import { ChartEmptyState } from "../ChartCard";

export function ShockAttributionChart() {
  const { result, selectedCountries, viewStep } = useSimulationStore();

  const data = useMemo(
    () => (result ? buildShockAttribution(result.data, selectedCountries, viewStep) : []),
    [result, selectedCountries, viewStep]
  );

  if (!result || data.length === 0) return <ChartEmptyState />;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 72 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F5F0EC" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 10, fill: "#A09890" }}
          axisLine={{ stroke: "#EDE9E4" }}
          tickLine={false}
          tickFormatter={(v) => v.toFixed(3)}
        />
        <YAxis
          type="category"
          dataKey="label"
          tick={{ fontSize: 10, fill: "#6B6560" }}
          axisLine={false}
          tickLine={false}
          width={68}
        />
        <Tooltip
          contentStyle={{ border: "1px solid #EDE9E4", borderRadius: 8, fontSize: 11, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}
          formatter={(v, name) => [typeof v === "number" ? v.toFixed(4) : v, String(name)]}
        />
        <Legend
          iconType="square"
          iconSize={8}
          wrapperStyle={{ fontSize: 10, paddingTop: 4 }}
        />
        <Bar dataKey="system" name="System"  stackId="a" fill="#2563EB" radius={[0, 0, 0, 0]} />
        <Bar dataKey="shock"  name="Shock"   stackId="a" fill="#E8541C" radius={[0, 0, 0, 0]} />
        <Bar dataKey="noise"  name="Noise"   stackId="a" fill="#D97706" radius={[0, 2, 2, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
