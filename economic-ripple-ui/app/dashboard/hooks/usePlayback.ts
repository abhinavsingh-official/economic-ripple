"use client";

import { useEffect, useRef } from "react";
import { useSimulationStore } from "../store/simulationStore";

export function usePlayback() {
  const { isPlaying, result, setIsPlaying } = useSimulationStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isPlaying || !result) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      const state = useSimulationStore.getState();
      if (!state.result) return;
      if (state.viewStep >= state.result.steps - 1) {
        state.setIsPlaying(false);
      } else {
        state.setViewStep(state.viewStep + 1);
      }
    }, 120);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, result, setIsPlaying]);
}
