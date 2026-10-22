"use client";

import { useMemo } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Legend, Tooltip, ResponsiveContainer,
} from "recharts";
import { useSimulationStore } from "../../store/simulationStore";
import { COUNTRY_LINE_COLORS } from "@/lib/constants";
import { buildRadarData } from "../../utils/chartHelpers";
import { ChartEmptyState } from "../ChartCard";

export function EconomicRadarChart() {
  const { result, selectedCountries, viewStep } = useSimulationStore();

  const data = useMemo(
    () => (result ? buildRadarData(result.data, selectedCountries, viewStep) : []),
    [result, selectedCountries, viewStep]
  );

  if (!result || selectedCountries.length === 0) return <ChartEmptyState message="Select countries and run" />;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid stroke="#EDE9E4" />
        <PolarAngleAxis
          dataKey="variable"
          tick={{ fontSize: 9, fill: "#6B6560" }}
        />
        <PolarRadiusAxis domain={[0, 1]} tick={false} axisLine={false} />
        <Tooltip
          contentStyle={{ border: "1px solid #EDE9E4", borderRadius: 8, fontSize: 11 }}
          formatter={(v) => (typeof v === "number" ? v.toFixed(3) : v)}
        />
        {selectedCountries.map((code, i) => (
          <Radar
            key={code}
            name={code}
            dataKey={code}
            stroke={COUNTRY_LINE_COLORS[i % COUNTRY_LINE_COLORS.length]}
            fill={COUNTRY_LINE_COLORS[i % COUNTRY_LINE_COLORS.length]}
            fillOpacity={0.12}
            strokeWidth={2}
          />
        ))}
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 10, paddingTop: 4 }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
