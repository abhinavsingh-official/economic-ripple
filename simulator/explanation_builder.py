import numpy as np
from typing import List


class ExplanationBuilder:
    """
    Converts causal decomposition into natural language.

    Aligned with:
        Δx = system_change + shock + noise
    """

    def __init__(self, system_matrix: np.ndarray, variables: List[str]):
        self.A = np.array(system_matrix, dtype=float)
        self.variables = variables
        self.n = len(variables)
        self.I = np.eye(self.n)

        self.threshold = 0.01

    # =========================================================
    # MAIN STEP EXPLANATION (FIXED)
    # =========================================================
    def explain_transition(
        self,
        prev_state,
        curr_state,
        system_change,
        shock,
        noise,
        total_change
    ):

        prev_state = np.array(prev_state, dtype=float)
        curr_state = np.array(curr_state, dtype=float)

        explanations = []

        for i, var in enumerate(self.variables):

            delta = total_change[i]

            if abs(delta) < self.threshold:
                continue

            drivers = self._get_drivers(i, prev_state)

            explanations.append(
                self._build_sentence(
                    target=var,
                    delta=delta,
                    system=system_change[i],
                    shock=shock[i],
                    noise=noise[i],
                    drivers=drivers
                )
            )

        return explanations

    # =========================================================
    # DRIVER ANALYSIS (CORRECTED)
    # =========================================================
    def _get_drivers(self, target_idx, prev_state):
        """
        Contribution to change:

            (A - I)[target, j] * x_j
        """

        contributions = []

        for j in range(self.n):

            coeff = self.A[target_idx, j] - (1.0 if j == target_idx else 0.0)

            if abs(coeff) < self.threshold:
                continue

            contrib = coeff * prev_state[j]

            contributions.append((self.variables[j], contrib))

        contributions.sort(key=lambda x: abs(x[1]), reverse=True)

        return contributions[:3]

    # =========================================================
    # NATURAL LANGUAGE BUILDER (CAUSAL)
    # =========================================================
    def _build_sentence(
        self,
        target,
        delta,
        system,
        shock,
        noise,
        drivers
    ):


        direction = "increased" if delta > 0 else "decreased"

        base = f"{target} {direction} by {abs(delta):.3f}."

        parts = []
        
        if abs(system) > self.threshold:
            parts.append(f"System: {system:.3f}")

        if abs(shock) > self.threshold:
            parts.append(f"Shock: {shock:.3f}")

        if abs(noise) > self.threshold:
            parts.append(f"Noise: {noise:.3f}")
    # =====================================================
    # DOMINANT CAUSE (NEW)
    # =====================================================
        components = {
            "system": abs(system),
            "shock": abs(shock),
            "noise": abs(noise)
        }

        dominant = max(components, key=components.get)

        # Only add if it's meaningful
        if components[dominant] > self.threshold:
            parts.append(f"Primary cause: {dominant}")
            
        if drivers:
            driver_text = ", ".join(
                [f"{v} ({c:.3f})" for v, c in drivers]
            )
            parts.append(f"Drivers: {driver_text}")
        
        return base + " | " + " | ".join(parts)
    


    # =========================================================
    # TRAJECTORY EXPLANATION (UPDATED)
    # =========================================================
    def explain_trajectory(
        self,
        states,
        system_changes,
        shocks,
        noises
    ):

        results = []

        for t in range(1, len(states)):

            total_change = states[t] - states[t - 1]

            results.append({
                "step": t,
                "explanations": self.explain_transition(
                    prev_state=states[t - 1],
                    curr_state=states[t],
                    system_change=system_changes[t],
                    shock=shocks[t],
                    noise=noises[t],
                    total_change=total_change
                )
            })

        return results

    # =========================================================
    # GLOBAL INFLUENCE (UNCHANGED BUT VALID)
    # =========================================================
    def variable_influence_summary(self):

        scores = []

        for j in range(self.n):
            score = np.sum(np.abs(self.A[:, j]))
            scores.append((self.variables[j], score))

        scores.sort(key=lambda x: x[1], reverse=True)

        return [
            {"variable": v, "influence_score": float(s)}
            for v, s in scores
        ]