"use client";

import { useEffect } from "react";
import { VARIABLE_LABELS } from "@/lib/constants";
import { useSimulationStore } from "../store/simulationStore";

export function useInsights() {
  const { result, selectedCountries, setInsights } = useSimulationStore();
  const primaryCountry = selectedCountries[0];

  useEffect(() => {
    if (!result || !primaryCountry) {
      setInsights([]);
      return;
    }

    const rows = result.data.filter((r) => r.country === primaryCountry);
    if (rows.length === 0) return;

    const first = rows[0];
    const last = rows[rows.length - 1];

    const insights = Object.entries(VARIABLE_LABELS).map(([key, label], idx) => {
      const startVal = first[key] as number;
      const endVal = last[key] as number;
      const delta = endVal - startVal;
      return { id: String(idx), title: label, value: endVal.toFixed(4), delta };
    });

    setInsights(insights);
  }, [result, primaryCountry, setInsights]);
}
