"use client";

import { useMemo, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { useSimulationStore } from "../../store/simulationStore";
import { COUNTRY_LINE_COLORS, VARIABLE_COLORS, VARIABLE_LABELS } from "@/lib/constants";
import { pivotByStep } from "../../utils/chartHelpers";
import { ChartEmptyState } from "../ChartCard";

const WELLBEING_VARS = [
  { key: "depression_prev", label: "Mental Health" },
  { key: "urbanization",    label: "Urbanization" },
  { key: "homicide_rate",   label: "Crime Rate" },
] as const;

type WellbeingKey = (typeof WELLBEING_VARS)[number]["key"];

export function WellbeingAreaChart() {
  const { result, selectedCountries, viewStep } = useSimulationStore();
  const [activeVar, setActiveVar] = useState<WellbeingKey>("depression_prev");

  const data = useMemo(
    () => (result ? pivotByStep(result.data, selectedCountries, activeVar) : []),
    [result, selectedCountries, activeVar]
  );

  const varColor = VARIABLE_COLORS[activeVar];

  const header = (
    <div className="flex gap-1">
      {WELLBEING_VARS.map((v) => (
        <button
          key={v.key}
          onClick={() => setActiveVar(v.key)}
          className="px-2 py-0.5 rounded text-[10px] font-semibold transition-all"
          style={{
            backgroundColor: activeVar === v.key ? varColor : "#FAF8F6",
            color: activeVar === v.key ? "white" : "#A09890",
            border: `1px solid ${activeVar === v.key ? varColor : "#EDE9E4"}`,
          }}
        >
          {v.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="flex items-center justify-between shrink-0">
        <div className="text-xs text-[#A09890]">
          All selected countries · {VARIABLE_LABELS[activeVar]}
        </div>
        {header}
      </div>
      {!result || data.length === 0 ? (
        <ChartEmptyState />
      ) : (
        <div className="flex-1 min-h-0">
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
                  fillOpacity={0.08}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 3, strokeWidth: 0 }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
