"use client";

import { useMemo } from "react";
import { useSimulationStore } from "../store/simulationStore";
import {
  ALL_VARIABLES,
  VARIABLE_LABELS,
  VARIABLE_COLORS,
  COUNTRY_LINE_COLORS,
  SCENARIOS,
} from "@/lib/constants";
import type { SimulationDataRow } from "@/lib/types";

// ─── Internal data ─────────────────────────────────────────────────────────────

// Effect scale: -2 = strong neg, -1 = mild neg, 0 = neutral, +1 = mild pos, +2 = strong pos
const SCENARIO_EFFECTS: Record<string, Record<string, number>> = {
  recession: {
    gdp_growth: -2,
    inflation: -1,
    unemployment_rate: 2,
    poverty_rate: 1,
    depression_prev: -1,
    urbanization: 0,
    homicide_rate: 1,
  },
  boom: {
    gdp_growth: 2,
    inflation: 2,
    unemployment_rate: -2,
    poverty_rate: -1,
    depression_prev: 1,
    urbanization: 1,
    homicide_rate: -1,
  },
  stagflation: {
    gdp_growth: -1,
    inflation: 2,
    unemployment_rate: 1,
    poverty_rate: 1,
    depression_prev: -1,
    urbanization: 0,
    homicide_rate: 1,
  },
  social_crisis: {
    gdp_growth: -1,
    inflation: 0,
    unemployment_rate: 1,
    poverty_rate: 2,
    depression_prev: -2,
    urbanization: -1,
    homicide_rate: 2,
  },
  recovery: {
    gdp_growth: 1,
    inflation: 0,
    unemployment_rate: -1,
    poverty_rate: -1,
    depression_prev: 1,
    urbanization: 0,
    homicide_rate: -1,
  },
};

const VARIABLE_INTERACTIONS = [
  {
    from: "gdp_growth",
    to: "unemployment_rate",
    direction: -1,
    desc: "Higher growth reduces unemployment pressure",
  },
  {
    from: "gdp_growth",
    to: "poverty_rate",
    direction: -1,
    desc: "Growth lifts households above poverty threshold",
  },
  {
    from: "gdp_growth",
    to: "urbanization",
    direction: 1,
    desc: "Economic expansion draws labor to cities",
  },
  {
    from: "inflation",
    to: "poverty_rate",
    direction: 1,
    desc: "Inflation erodes real incomes, worsening poverty",
  },
  {
    from: "inflation",
    to: "gdp_growth",
    direction: -1,
    desc: "High inflation dampens real output and investment",
  },
  {
    from: "unemployment_rate",
    to: "depression_prev",
    direction: 1,
    desc: "Job loss is a primary driver of mental health decline",
  },
  {
    from: "unemployment_rate",
    to: "poverty_rate",
    direction: 1,
    desc: "Loss of income directly raises poverty rates",
  },
  {
    from: "unemployment_rate",
    to: "homicide_rate",
    direction: 1,
    desc: "Joblessness correlates with increased crime rates",
  },
  {
    from: "poverty_rate",
    to: "depression_prev",
    direction: 1,
    desc: "Persistent poverty deteriorates mental wellbeing",
  },
  {
    from: "poverty_rate",
    to: "homicide_rate",
    direction: 1,
    desc: "Poverty is a structural driver of violent crime",
  },
  {
    from: "depression_prev",
    to: "homicide_rate",
    direction: 1,
    desc: "Mental health deterioration correlates with crime",
  },
  {
    from: "urbanization",
    to: "gdp_growth",
    direction: 1,
    desc: "Urban density amplifies productivity and specialization",
  },
  {
    from: "urbanization",
    to: "unemployment_rate",
    direction: -1,
    desc: "Urban migration expands labor market access",
  },
];

// ─── Sub-component helpers ─────────────────────────────────────────────────────

function EffectBadge({ effect }: { effect: number }) {
  if (effect === 2)
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#15803D]">
        ●● Strongly Positive
      </span>
    );
  if (effect === 1)
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16A34A]">
        ● Mildly Positive
      </span>
    );
  if (effect === 0)
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#A09890]">
        — Neutral
      </span>
    );
  if (effect === -1)
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#EA580C]">
        ● Mildly Negative
      </span>
    );
  if (effect === -2)
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#DC2626]">
        ●● Strongly Negative
      </span>
    );
  return null;
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#A09890] whitespace-nowrap">
        {children}
      </span>
      <div className="flex-1 h-px bg-[#EDE9E4]" />
    </div>
  );
}

function StatChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#FAF8F6] border border-[#EDE9E4] text-[11px] font-medium text-[#344054]">
      {label}
    </span>
  );
}

// ─── Section 1: How the Model Works ───────────────────────────────────────────

function ModelSection() {
  return (
    <div className="bg-white rounded-xl border border-[#EDE9E4] p-5">
      <SectionHeader>How the Model Works</SectionHeader>
      <p className="text-[13px] text-[#344054] leading-relaxed mb-4">
        Economic Ripple uses a system-dynamics model where seven macroeconomic variables evolve
        jointly over time. At each step, the state vector{" "}
        <span className="font-mono text-[#E8541C]">x(t)</span> is updated by{" "}
        <span className="font-mono text-[#E8541C] bg-[#FFF5F0] px-1.5 py-0.5 rounded">
          x(t+1) = A&middot;x(t) + &sigma; + &epsilon;
        </span>{" "}
        — where <span className="font-mono">A</span> is a 7&times;7 interaction matrix encoding
        structural relationships, <span className="font-mono">&sigma;</span> is the scenario shock
        vector, and <span className="font-mono">&epsilon;</span> represents stochastic noise.
        Countries run independently; each has the same interaction matrix calibrated to global
        averages.
      </p>
      <div className="flex flex-wrap gap-2">
        <StatChip label="7 Variables" />
        <StatChip label="7×7 Interaction Matrix" />
        <StatChip label="Independent per Country" />
      </div>
    </div>
  );
}

// ─── Section 2: Scenario + Shocks ─────────────────────────────────────────────

function ScenarioCard({
  scenarioId,
  effects,
}: {
  scenarioId: string;
  effects: Record<string, number> | undefined;
}) {
  const scenario = SCENARIOS.find((s) => s.id === scenarioId);

  if (!scenarioId || !scenario) {
    return (
      <div className="bg-white rounded-xl border border-[#EDE9E4] p-5">
        <SectionHeader>Current Scenario</SectionHeader>
        <p className="text-[13px] text-[#A09890]">No scenario selected.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#EDE9E4] p-5">
      <SectionHeader>Current Scenario</SectionHeader>
      <div className="mb-4">
        <div className="text-[15px] font-bold text-[#1A1614] mb-1">{scenario.name}</div>
        <div className="text-[12px] text-[#6B6560] leading-relaxed">{scenario.description}</div>
      </div>
      {effects && (
        <div className="flex flex-col gap-1.5">
          {ALL_VARIABLES.map((varKey) => {
            const effect = effects[varKey] ?? 0;
            const color = VARIABLE_COLORS[varKey] ?? "#374151";
            return (
              <div
                key={varKey}
                className="flex items-center justify-between gap-2 py-1.5 px-2.5 rounded-lg bg-[#FAF8F6]"
              >
                <span
                  className="text-[12px] font-medium"
                  style={{ color }}
                >
                  {VARIABLE_LABELS[varKey]}
                </span>
                <EffectBadge effect={effect} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ShocksCard({ manualShocks }: { manualShocks: Record<string, number> }) {
  const nonZero = useMemo(
    () => Object.entries(manualShocks).filter(([, v]) => v !== 0),
    [manualShocks]
  );

  return (
    <div className="bg-white rounded-xl border border-[#EDE9E4] p-5">
      <SectionHeader>Manual Shocks</SectionHeader>
      {nonZero.length === 0 ? (
        <p className="text-[13px] text-[#A09890]">
          No manual shocks applied — base scenario parameters used.
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-2 mb-4">
            {nonZero.map(([key, val]) => {
              const color = VARIABLE_COLORS[key] ?? "#374151";
              const isPos = val >= 0;
              const barWidth = Math.min(100, Math.abs(val) * 100);
              return (
                <div key={key} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium" style={{ color }}>
                      {VARIABLE_LABELS[key] ?? key}
                    </span>
                    <span
                      className="text-[12px] font-bold font-mono"
                      style={{ color: isPos ? "#16A34A" : "#DC2626" }}
                    >
                      {isPos ? "+" : ""}
                      {val.toFixed(3)}
                    </span>
                  </div>
                  <div className="relative h-1.5 bg-[#EDE9E4] rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 h-full rounded-full transition-all"
                      style={{
                        width: `${barWidth}%`,
                        left: isPos ? "50%" : `${50 - barWidth / 2}%`,
                        background: isPos ? "#16A34A" : "#DC2626",
                        maxWidth: "50%",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-[#A09890]">
            Manual shocks are additive on top of the scenario shock vector at each time step.
          </p>
        </>
      )}
    </div>
  );
}

// ─── Section 3: Variable Interaction Map ──────────────────────────────────────

function InteractionMap() {
  return (
    <div className="bg-white rounded-xl border border-[#EDE9E4] p-5">
      <SectionHeader>Variable Interaction Map</SectionHeader>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr className="bg-[#FAF8F6]">
              <th className="text-left py-2 px-3 text-[10px] font-bold uppercase tracking-widest text-[#A09890] border-b border-[#EDE9E4]">
                Source Variable
              </th>
              <th className="text-left py-2 px-3 text-[10px] font-bold uppercase tracking-widest text-[#A09890] border-b border-[#EDE9E4]">
                Target Variable
              </th>
              <th className="text-left py-2 px-3 text-[10px] font-bold uppercase tracking-widest text-[#A09890] border-b border-[#EDE9E4]">
                Direction
              </th>
              <th className="text-left py-2 px-3 text-[10px] font-bold uppercase tracking-widest text-[#A09890] border-b border-[#EDE9E4]">
                Mechanism
              </th>
            </tr>
          </thead>
          <tbody>
            {VARIABLE_INTERACTIONS.map((item, idx) => {
              const fromColor = VARIABLE_COLORS[item.from] ?? "#374151";
              const toColor = VARIABLE_COLORS[item.to] ?? "#374151";
              const dirColor = item.direction === 1 ? "#D97706" : "#16A34A";
              const dirLabel = item.direction === 1 ? "↑ Raises" : "↓ Lowers";
              return (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-white" : "bg-[#FAF8F6]"}
                >
                  <td className="py-2 px-3 font-medium border-b border-[#F3F0ED]">
                    <span style={{ color: fromColor }}>{VARIABLE_LABELS[item.from]}</span>
                  </td>
                  <td className="py-2 px-3 border-b border-[#F3F0ED]">
                    <span style={{ color: toColor }}>{VARIABLE_LABELS[item.to]}</span>
                  </td>
                  <td className="py-2 px-3 border-b border-[#F3F0ED]">
                    <span
                      className="inline-flex items-center font-semibold text-[11px]"
                      style={{ color: dirColor }}
                    >
                      {dirLabel}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-[#6B6560] border-b border-[#F3F0ED]">
                    {item.desc}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Section 4: Results Analysis ──────────────────────────────────────────────

type CountrySummary = {
  country: string;
  color: string;
  gdpDelta: number;
  unempDelta: number;
  povertyDelta: number;
};

type RankEntry = {
  country: string;
  value: number;
};

type BiggestMover = {
  country: string;
  variable: string;
  delta: number;
};

type ResultsData = {
  countryRankings: {
    gdp: { top: RankEntry; bottom: RankEntry };
    unemployment: { top: RankEntry; bottom: RankEntry };
    poverty: { top: RankEntry; bottom: RankEntry };
  };
  biggestMover: BiggestMover;
  countrySummaries: CountrySummary[];
};

function computeResultsData(
  data: SimulationDataRow[],
  countries: string[]
): ResultsData | null {
  if (!data.length || !countries.length) return null;

  const maxStep = Math.max(...data.map((r) => r.step));
  const minStep = Math.min(...data.map((r) => r.step));

  const getVal = (country: string, step: number, key: string): number => {
    const row = data.find((r) => r.country === country && r.step === step);
    return row ? (row[key] as number) : 0;
  };

  // Final-step values for GDP ranking
  const gdpFinal = countries.map((c) => ({
    country: c,
    value: getVal(c, maxStep, "gdp_growth"),
  }));
  const unempFinal = countries.map((c) => ({
    country: c,
    value: getVal(c, maxStep, "unemployment_rate"),
  }));
  const povertyFinal = countries.map((c) => ({
    country: c,
    value: getVal(c, maxStep, "poverty_rate"),
  }));

  const sortedGdp = [...gdpFinal].sort((a, b) => b.value - a.value);
  const sortedUnemp = [...unempFinal].sort((a, b) => a.value - b.value); // lower is better
  const sortedPoverty = [...povertyFinal].sort((a, b) => a.value - b.value); // lower is better

  // Biggest movers across all variable × country combos
  let biggestMover: BiggestMover = { country: "", variable: "", delta: 0 };
  for (const country of countries) {
    for (const varKey of ALL_VARIABLES) {
      const start = getVal(country, minStep, varKey);
      const end = getVal(country, maxStep, varKey);
      const delta = end - start;
      if (Math.abs(delta) > Math.abs(biggestMover.delta)) {
        biggestMover = { country, variable: varKey, delta };
      }
    }
  }

  // Country summaries
  const countrySummaries: CountrySummary[] = countries.map((c, idx) => ({
    country: c,
    color: COUNTRY_LINE_COLORS[idx % COUNTRY_LINE_COLORS.length],
    gdpDelta: getVal(c, maxStep, "gdp_growth") - getVal(c, minStep, "gdp_growth"),
    unempDelta:
      getVal(c, maxStep, "unemployment_rate") - getVal(c, minStep, "unemployment_rate"),
    povertyDelta: getVal(c, maxStep, "poverty_rate") - getVal(c, minStep, "poverty_rate"),
  }));

  return {
    countryRankings: {
      gdp: {
        top: sortedGdp[0] ?? { country: "—", value: 0 },
        bottom: sortedGdp[sortedGdp.length - 1] ?? { country: "—", value: 0 },
      },
      unemployment: {
        top: sortedUnemp[0] ?? { country: "—", value: 0 },
        bottom: sortedUnemp[sortedUnemp.length - 1] ?? { country: "—", value: 0 },
      },
      poverty: {
        top: sortedPoverty[0] ?? { country: "—", value: 0 },
        bottom: sortedPoverty[sortedPoverty.length - 1] ?? { country: "—", value: 0 },
      },
    },
    biggestMover,
    countrySummaries,
  };
}

function fmtDelta(n: number, decimals = 2): string {
  return (n >= 0 ? "+" : "") + n.toFixed(decimals);
}

function ResultsSection({ data, countries }: { data: SimulationDataRow[]; countries: string[] }) {
  const resultsData = useMemo(
    () => computeResultsData(data, countries),
    [data, countries]
  );

  if (!resultsData) return null;

  const { countryRankings, biggestMover, countrySummaries } = resultsData;

  return (
    <div className="bg-white rounded-xl border border-[#EDE9E4] p-5">
      <SectionHeader>Results Analysis</SectionHeader>

      {/* Rankings */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {(
          [
            {
              label: "GDP Growth",
              key: "gdp",
              topLabel: "Highest",
              bottomLabel: "Lowest",
              suffix: "%",
            },
            {
              label: "Unemployment",
              key: "unemployment",
              topLabel: "Lowest",
              bottomLabel: "Highest",
              suffix: "%",
            },
            {
              label: "Poverty Rate",
              key: "poverty",
              topLabel: "Lowest",
              bottomLabel: "Highest",
              suffix: "%",
            },
          ] as const
        ).map(({ label, key, topLabel, bottomLabel, suffix }) => {
          const ranking = countryRankings[key];
          return (
            <div
              key={key}
              className="bg-[#FAF8F6] rounded-lg border border-[#EDE9E4] p-3 flex flex-col gap-2"
            >
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#A09890]">
                {label}
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-[#6B6560]">{topLabel}</span>
                  <span className="text-[12px] font-semibold text-[#15803D]">
                    {ranking.top.country}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-[#6B6560]">{bottomLabel}</span>
                  <span className="text-[12px] font-semibold text-[#DC2626]">
                    {ranking.bottom.country}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Biggest mover */}
      {biggestMover.country && (
        <div className="bg-[#FFF5F0] border border-[#FDDCCC] rounded-lg p-3 mb-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#E8541C] mb-1">
            Biggest Mover
          </div>
          <div className="text-[13px] text-[#1A1614]">
            <span className="font-semibold">{biggestMover.country}</span>
            {" — "}
            <span style={{ color: VARIABLE_COLORS[biggestMover.variable] ?? "#374151" }}>
              {VARIABLE_LABELS[biggestMover.variable]}
            </span>
            {" shifted by "}
            <span
              className="font-bold"
              style={{ color: biggestMover.delta >= 0 ? "#16A34A" : "#DC2626" }}
            >
              {fmtDelta(biggestMover.delta)}
            </span>
          </div>
        </div>
      )}

      {/* Country summaries */}
      <div className="flex flex-col gap-1.5">
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#A09890] mb-1">
          Country Summaries (t0 → tN)
        </div>
        {countrySummaries.map((s) => (
          <div
            key={s.country}
            className="flex items-start gap-2 py-2 px-3 rounded-lg bg-[#FAF8F6] border border-[#EDE9E4]"
          >
            <span
              className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
              style={{ background: s.color }}
            />
            <div className="flex-1 text-[12px] text-[#344054]">
              <span className="font-semibold">{s.country}:</span>
              {" GDP "}
              <span
                className="font-mono font-bold"
                style={{ color: s.gdpDelta >= 0 ? "#16A34A" : "#DC2626" }}
              >
                {fmtDelta(s.gdpDelta)}%
              </span>
              {", Unemployment "}
              <span
                className="font-mono font-bold"
                style={{ color: s.unempDelta <= 0 ? "#16A34A" : "#DC2626" }}
              >
                {fmtDelta(s.unempDelta)}
              </span>
              {", Poverty "}
              <span
                className="font-mono font-bold"
                style={{ color: s.povertyDelta <= 0 ? "#16A34A" : "#DC2626" }}
              >
                {fmtDelta(s.povertyDelta)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Root Component ────────────────────────────────────────────────────────────

export function InsightsPanel() {
  const { result, selectedScenarioId, manualShocks, selectedCountries } = useSimulationStore();

  const effects = useMemo(
    () => (selectedScenarioId ? SCENARIO_EFFECTS[selectedScenarioId] : undefined),
    [selectedScenarioId]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Section 1: Model explanation */}
      <ModelSection />

      {/* Section 2: Scenario + Shocks side by side */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ScenarioCard scenarioId={selectedScenarioId} effects={effects} />
        <ShocksCard manualShocks={manualShocks} />
      </div>

      {/* Section 3: Interaction map */}
      <InteractionMap />

      {/* Section 4: Results analysis (only when data exists) */}
      {result !== null && (
        <ResultsSection
          data={result.data}
          countries={selectedCountries.length > 0 ? selectedCountries : result.countries}
        />
      )}
    </div>
  );
}
