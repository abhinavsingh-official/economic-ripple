import { apiFetch } from "@/lib/apiClient";
import type { SimulationRequest, SimulationResult } from "@/lib/types";

export const api = {
  runSimulation: (req: SimulationRequest) =>
    apiFetch<SimulationResult>("/api/simulate", {
      method: "POST",
      body: JSON.stringify(req),
    }),
};
