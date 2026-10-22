export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export const COUNTRIES = [
  { code: "Albania", name: "Albania" },
  { code: "Argentina", name: "Argentina" },
  { code: "Australia", name: "Australia" },
  { code: "Bangladesh", name: "Bangladesh" },
  { code: "Canada", name: "Canada" },
  { code: "China", name: "China" },
  { code: "Finland", name: "Finland" },
  { code: "France", name: "France" },
  { code: "Georgia", name: "Georgia" },
  { code: "Germany", name: "Germany" },
  { code: "Iceland", name: "Iceland" },
  { code: "India", name: "India" },
  { code: "Indonesia", name: "Indonesia" },
  { code: "Israel", name: "Israel" },
  { code: "Italy", name: "Italy" },
  { code: "Jamaica", name: "Jamaica" },
  { code: "Japan", name: "Japan" },
  { code: "Philippines", name: "Philippines" },
  { code: "Poland", name: "Poland" },
  { code: "Russia", name: "Russia" },
  { code: "Spain", name: "Spain" },
  { code: "Sri Lanka", name: "Sri Lanka" },
  { code: "Sweden", name: "Sweden" },
  { code: "Switzerland", name: "Switzerland" },
  { code: "Thailand", name: "Thailand" },
  { code: "Ukraine", name: "Ukraine" },
];

export const DEFAULT_SELECTED_COUNTRIES = ["China", "Germany", "India", "Japan"];

export const SCENARIOS = [
  {
    id: "recession",
    name: "Recession",
    description:
      "Economic contraction with rising unemployment, falling output, and reduced consumer spending.",
  },
  {
    id: "boom",
    name: "Economic Boom",
    description:
      "Rapid growth phase with surging GDP, inflationary pressure, and high consumption.",
  },
  {
    id: "stagflation",
    name: "Stagflation",
    description:
      "The worst of both worlds — stagnant growth combined with persistent high inflation.",
  },
  {
    id: "social_crisis",
    name: "Social Crisis",
    description:
      "Societal instability marked by rising crime, mental health deterioration, and poverty expansion.",
  },
  {
    id: "recovery",
    name: "Recovery",
    description:
      "Post-shock normalization as economic fundamentals stabilize and indicators return to trend.",
  },
];

export const VARIABLE_LABELS: Record<string, string> = {
  depression_prev: "Mental Health",
  gdp_growth: "GDP Growth",
  inflation: "Inflation",
  unemployment_rate: "Unemployment",
  poverty_rate: "Poverty Rate",
  urbanization: "Urbanization",
  homicide_rate: "Crime Rate",
};

export const VARIABLE_COLORS: Record<string, string> = {
  gdp_growth: "#E8541C",
  inflation: "#DC2626",
  unemployment_rate: "#D97706",
  poverty_rate: "#7C3AED",
  depression_prev: "#6B7280",
  urbanization: "#16A34A",
  homicide_rate: "#374151",
};

export const ALL_VARIABLES = [
  "gdp_growth",
  "inflation",
  "unemployment_rate",
  "poverty_rate",
  "depression_prev",
  "urbanization",
  "homicide_rate",
] as const;

export type VariableKey = (typeof ALL_VARIABLES)[number];

export const VARIABLE_BOUNDS: Record<string, [number, number]> = {
  gdp_growth:        [-5,  5],
  inflation:         [-2, 10],
  unemployment_rate: [ 0,  5],
  poverty_rate:      [ 0,  5],
  depression_prev:   [-2,  2],
  urbanization:      [-1,  1],
  homicide_rate:     [-2,  2],
};

export const PRIMARY_CHART_VARIABLES = [
  { key: "gdp_growth",       label: "GDP Growth (%)" },
  { key: "inflation",        label: "Inflation (%)" },
  { key: "unemployment_rate",label: "Unemployment (%)" },
];

export const SHOCK_VARIABLES = [
  { key: "gdp_growth",        label: "GDP Growth" },
  { key: "inflation",         label: "Inflation" },
  { key: "unemployment_rate", label: "Unemployment" },
  { key: "poverty_rate",      label: "Poverty Rate" },
  { key: "depression_prev",   label: "Mental Health" },
  { key: "urbanization",      label: "Urbanization" },
  { key: "homicide_rate",     label: "Crime Rate" },
];

export const COUNTRY_LINE_COLORS = [
  "#E8541C",
  "#2563EB",
  "#16A34A",
  "#DC2626",
  "#7C3AED",
  "#D97706",
  "#0891B2",
  "#BE185D",
  "#059669",
  "#92400E",
  "#065F46",
  "#1D4ED8",
  "#991B1B",
  "#5B21B6",
  "#B45309",
];

export const DEFAULT_STEPS = 30;
