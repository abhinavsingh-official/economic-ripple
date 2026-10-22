import type { SimulationDataRow } from "@/lib/types";
import { VARIABLE_BOUNDS, VARIABLE_LABELS, ALL_VARIABLES } from "@/lib/constants";

/** Pivot result rows into step-keyed records for multi-country line/area charts.
 *  Returns [{ step, [countryCode]: value, ... }] sorted by step. */
export function pivotByStep(
  data: SimulationDataRow[],
  countries: string[],
  variableKey: string
): Array<Record<string, number>> {
  const stepMap = new Map<number, Record<string, number>>();
  data
    .filter((row) => countries.includes(row.country as string))
    .forEach((row) => {
      const s = row.step;
      if (!stepMap.has(s)) stepMap.set(s, { step: s });
      stepMap.get(s)![row.country as string] = +(row[variableKey] as number).toFixed(4);
    });
  return Array.from(stepMap.values()).sort((a, b) => a.step - b.step);
}

/** Get the data rows for the given countries at a specific step. */
export function snapshotAtStep(
  data: SimulationDataRow[],
  countries: string[],
  step: number
): SimulationDataRow[] {
  return countries.map(
    (code) =>
      data.find((r) => r.country === code && r.step === step) ??
      data.filter((r) => r.country === code).at(-1)!
  ).filter(Boolean);
}

/** Normalize a variable value to [0, 1] using VARIABLE_BOUNDS. */
export function normalizeVariable(key: string, value: number): number {
  const bounds = VARIABLE_BOUNDS[key];
  if (!bounds) return 0.5;
  const [min, max] = bounds;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

/** Build radar chart data: [{ variable, [countryCode]: normalizedValue, ... }] */
export function buildRadarData(
  data: SimulationDataRow[],
  countries: string[],
  step: number
): Array<Record<string, string | number>> {
  const snapshot = snapshotAtStep(data, countries, step);
  return ALL_VARIABLES.map((key) => {
    const entry: Record<string, string | number> = {
      variable: VARIABLE_LABELS[key] ?? key,
    };
    snapshot.forEach((row) => {
      entry[row.country as string] = normalizeVariable(key, row[key] as number);
    });
    return entry;
  });
}

/** Build snapshot bar data: [{ country, gdp_growth, inflation, ... }] at viewStep */
export function buildSnapshotData(
  data: SimulationDataRow[],
  countries: string[],
  step: number
): Array<Record<string, string | number>> {
  return snapshotAtStep(data, countries, step).map((row) => {
    const entry: Record<string, string | number> = { country: row.country as string };
    ALL_VARIABLES.forEach((key) => {
      entry[key] = +(row[key] as number).toFixed(3);
    });
    return entry;
  });
}

/** Build shock attribution data: [{variable, label, system, shock, noise}] averaged across countries at viewStep */
export function buildShockAttribution(
  data: SimulationDataRow[],
  countries: string[],
  step: number
): Array<{ variable: string; label: string; system: number; shock: number; noise: number }> {
  const snapshot = snapshotAtStep(data, countries, step);
  if (snapshot.length === 0) return [];

  return ALL_VARIABLES.map((key) => {
    let sysSum = 0, shockSum = 0, noiseSum = 0;
    snapshot.forEach((row) => {
      sysSum   += Math.abs(row[`${key}_system_delta`] as number ?? 0);
      shockSum += Math.abs(row[`${key}_shock`]        as number ?? 0);
      noiseSum += Math.abs(row[`${key}_noise`]        as number ?? 0);
    });
    const n = snapshot.length;
    return {
      variable: key,
      label: VARIABLE_LABELS[key] ?? key,
      system: +(sysSum   / n).toFixed(4),
      shock:  +(shockSum / n).toFixed(4),
      noise:  +(noiseSum / n).toFixed(4),
    };
  });
}
