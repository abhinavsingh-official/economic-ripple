"use client";

import { useEffect, useRef } from "react";
import { useSimulationStore } from "../store/simulationStore";

export function useAutoRun(run: () => void) {
  const manualShocks = useSimulationStore((s) => s.manualShocks);
  const selectedCountries = useSimulationStore((s) => s.selectedCountries);
  const result = useSimulationStore((s) => s.result);

  const runRef = useRef(run);
  useEffect(() => { runRef.current = run; });

  const isFirstRender = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-run when shocks change (only after first run)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!result) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => runRef.current(), 800);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manualShocks]);

  // Auto-run when country selection changes and new country not in current result
  useEffect(() => {
    if (!result) return;
    const hasNew = selectedCountries.some((c) => !result.countries.includes(c));
    if (!hasNew) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => runRef.current(), 400);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountries]);
}
