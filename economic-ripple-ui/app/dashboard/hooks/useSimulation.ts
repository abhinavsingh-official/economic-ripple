"use client";

import { useCallback, useEffect } from "react";
import { SCENARIOS } from "@/lib/constants";
import { api } from "../services/api";
import { useSimulationStore } from "../store/simulationStore";

export function useSimulation() {
  const {
    scenarios,
    setScenarios,
    selectedCountries,
    selectedScenarioId,
    steps,
    manualShocks,
    setSelectedScenarioId,
    setIsLoading,
    setError,
    setResult,
    setViewStep,
  } = useSimulationStore();

  useEffect(() => {
    setScenarios(SCENARIOS);
    if (!selectedScenarioId && SCENARIOS.length > 0) {
      setSelectedScenarioId(SCENARIOS[0].id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const run = useCallback(async () => {
    if (selectedCountries.length === 0 || !selectedScenarioId) return;

    setIsLoading(true);
    setError(null);

    try {
      const hasShocks = Object.values(manualShocks).some((v) => v !== 0);
      const result = await api.runSimulation({
        countries: selectedCountries,
        steps,
        scenario: selectedScenarioId,
        scale: 1.0,
        ...(hasShocks && { manual: manualShocks }),
      });
      setResult(result);
      setViewStep(result.steps - 1);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Simulation failed");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedCountries,
    selectedScenarioId,
    steps,
    manualShocks,
    setError,
    setIsLoading,
    setResult,
    setViewStep,
  ]);

  return { scenarios, run };
}
