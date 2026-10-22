"use client";

import { useEffect } from "react";
import { COUNTRIES, DEFAULT_SELECTED_COUNTRIES } from "@/lib/constants";
import { useSimulationStore } from "../store/simulationStore";

export function useCountries() {
  const { setCountries, setSelectedCountries, selectedCountries } = useSimulationStore();

  useEffect(() => {
    setCountries(COUNTRIES);
    if (selectedCountries.length === 0) {
      const defaults = DEFAULT_SELECTED_COUNTRIES.filter((code) =>
        COUNTRIES.some((c) => c.code === code)
      );
      setSelectedCountries(defaults);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
