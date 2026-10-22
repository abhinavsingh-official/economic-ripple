"use client";

import { create } from "zustand";
import type { Country, Insight, Scenario, SimulationResult } from "@/lib/types";
import { DEFAULT_STEPS } from "@/lib/constants";

export type ComparisonMode = "single" | "country" | "scenario";

type SimulationState = {
  countries: Country[];
  scenarios: Scenario[];
  insights: Insight[];
  selectedCountries: string[];
  selectedScenarioId: string;
  steps: number;
  result: SimulationResult | null;
  isLoading: boolean;
  error: string | null;
  manualShocks: Record<string, number>;
  viewStep: number;
  isPlaying: boolean;
  comparisonMode: ComparisonMode;

  setCountries: (countries: Country[]) => void;
  setScenarios: (scenarios: Scenario[]) => void;
  setInsights: (insights: Insight[]) => void;
  setSelectedCountries: (codes: string[]) => void;
  toggleCountry: (code: string) => void;
  setSelectedScenarioId: (id: string) => void;
  setSteps: (steps: number) => void;
  setResult: (result: SimulationResult | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setManualShock: (key: string, value: number) => void;
  setViewStep: (step: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setComparisonMode: (mode: ComparisonMode) => void;
};

export const useSimulationStore = create<SimulationState>((set) => ({
  countries: [],
  scenarios: [],
  insights: [],
  selectedCountries: [],
  selectedScenarioId: "",
  steps: DEFAULT_STEPS,
  result: null,
  isLoading: false,
  error: null,
  manualShocks: {},
  viewStep: 0,
  isPlaying: false,
  comparisonMode: "single",

  setCountries: (countries) => set({ countries }),
  setScenarios: (scenarios) => set({ scenarios }),
  setInsights: (insights) => set({ insights }),
  setSelectedCountries: (selectedCountries) => set({ selectedCountries }),
  toggleCountry: (code) =>
    set((state) => ({
      selectedCountries: state.selectedCountries.includes(code)
        ? state.selectedCountries.filter((c) => c !== code)
        : [...state.selectedCountries, code],
    })),
  setSelectedScenarioId: (selectedScenarioId) => set({ selectedScenarioId }),
  setSteps: (steps) => set({ steps }),
  setResult: (result) => set({ result }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setManualShock: (key, value) =>
    set((state) => ({
      manualShocks: { ...state.manualShocks, [key]: value },
    })),
  setViewStep: (viewStep) => set({ viewStep }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setComparisonMode: (comparisonMode) => set({ comparisonMode }),
}));
