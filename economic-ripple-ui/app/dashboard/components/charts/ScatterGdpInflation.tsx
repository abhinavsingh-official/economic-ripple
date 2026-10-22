"use client";

import { useMemo } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Label,
} from "recharts";
import { useSimulationStore } from "../../store/simulationStore";
import { COUNTRY_LINE_COLORS } from "@/lib/constants";
import { ChartEmptyState } from "../ChartCard";

type Point = { gdp_growth: number; inflation: number; name: string };

const CustomDot = (props: { cx?: number; cy?: number; fill?: string; name?: string }) => {
  const { cx = 0, cy = 0, fill = "#E8541C", name = "" } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={7} fill={fill} fillOpacity={0.85} />
      <text x={cx} y={cy - 10} textAnchor="middle" fontSize={9} fill="#6B6560" fontWeight={600}>
        {name}
      </text>
    </g>
  );
};

export function ScatterGdpInflation() {
  const { result, selectedCountries, viewStep } = useSimulationStore();

  const series = useMemo<{ code: string; color: string; point: Point[] }[]>(() => {
    if (!result) return [];
    return selectedCountries.map((code, i) => {
      const row = result.data.find((r) => r.country === code && r.step === viewStep)
        ?? result.data.filter((r) => r.country === code).at(-1);
      return {
        code,
        color: COUNTRY_LINE_COLORS[i % COUNTRY_LINE_COLORS.length],
        point: row
          ? [{ gdp_growth: +row.gdp_growth.toFixed(4), inflation: +row.inflation.toFixed(4), name: code }]
          : [],
      };
    });
  }, [result, selectedCountries, viewStep]);

  if (!result || selectedCountries.length === 0) return <ChartEmptyState message="Select countries and run" />;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 16, right: 16, bottom: 28, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F5F0EC" />
        <XAxis dataKey="gdp_growth" type="number" name="GDP Growth" tick={{ fontSize: 10, fill: "#A09890" }} axisLine={{ stroke: "#EDE9E4" }} tickLine={false} tickFormatter={(v) => `${v.toFixed(1)}%`}>
          <Label value="GDP Growth (%)" position="insideBottom" offset={-14} fontSize={10} fill="#A09890" />
        </XAxis>
        <YAxis dataKey="inflation" type="number" name="Inflation" tick={{ fontSize: 10, fill: "#A09890" }} axisLine={false} tickLine={false} width={42} tickFormatter={(v) => `${v.toFixed(1)}%`}>
          <Label value="Inflation (%)" angle={-90} position="insideLeft" offset={12} fontSize={10} fill="#A09890" />
        </YAxis>
        <Tooltip
          cursor={{ strokeDasharray: "3 3", stroke: "#EDE9E4" }}
          contentStyle={{ border: "1px solid #EDE9E4", borderRadius: 8, fontSize: 11 }}
          formatter={(v, name) => [typeof v === "number" ? `${v.toFixed(3)}%` : v, String(name)]}
        />
        {series.map(({ code, color, point }) => (
          <Scatter
            key={code}
            name={code}
            data={point}
            fill={color}
            shape={<CustomDot fill={color} name={code} />}
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
}
