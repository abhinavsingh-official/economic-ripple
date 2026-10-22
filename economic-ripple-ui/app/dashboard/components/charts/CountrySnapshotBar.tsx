"use client";

import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { useSimulationStore } from "../../store/simulationStore";
import { VARIABLE_COLORS, VARIABLE_LABELS, ALL_VARIABLES } from "@/lib/constants";
import { buildSnapshotData } from "../../utils/chartHelpers";
import { ChartEmptyState } from "../ChartCard";

export function CountrySnapshotBar() {
  const { result, selectedCountries, viewStep } = useSimulationStore();

  const data = useMemo(
    () => (result ? buildSnapshotData(result.data, selectedCountries, viewStep) : []),
    [result, selectedCountries, viewStep]
  );

  if (!result || data.length === 0) return <ChartEmptyState />;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 8, bottom: 2, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F5F0EC" vertical={false} />
        <XAxis
          dataKey="country"
          tick={{ fontSize: 10, fill: "#A09890" }}
          axisLine={{ stroke: "#EDE9E4" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#A09890" }}
          axisLine={false}
          tickLine={false}
          width={40}
          tickFormatter={(v) => v.toFixed(1)}
        />
        <Tooltip
          contentStyle={{ border: "1px solid #EDE9E4", borderRadius: 8, fontSize: 11, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}
          formatter={(v, name) => [typeof v === "number" ? v.toFixed(3) : v, VARIABLE_LABELS[String(name)] ?? String(name)]}
        />
        <Legend
          iconType="square"
          iconSize={8}
          wrapperStyle={{ fontSize: 9, paddingTop: 4 }}
          formatter={(v) => VARIABLE_LABELS[v] ?? v}
        />
        {ALL_VARIABLES.map((key) => (
          <Bar
            key={key}
            dataKey={key}
            name={key}
            fill={VARIABLE_COLORS[key]}
            radius={[2, 2, 0, 0]}
            maxBarSize={12}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
