import numpy as np


class ShockApplier:
    """
    Structural dynamics engine:

    x(t+1) = A x(t) + shock(t)

    NOTE:
    - No damping here (handled in simulator)
    - No noise here (handled in simulator)
    """

    def __init__(self, system_matrix: np.ndarray):
        self.A = np.asarray(system_matrix, dtype=float)
        self._validate_matrix()

    # =========================================================
    # CORE STEP
    # =========================================================
    def step(self, state: np.ndarray, shock: np.ndarray) -> np.ndarray:
        state = np.asarray(state, dtype=float)
        shock = np.asarray(shock, dtype=float)

        return self.A @ state + shock

    # =========================================================
    # MULTI STEP SIMULATION
    # =========================================================
    def simulate(self, initial_state: np.ndarray, shocks: list):
        state = np.asarray(initial_state, dtype=float)
        trajectory = [state.copy()]

        for shock in shocks:
            state = self.step(state, shock)
            trajectory.append(state.copy())

        return np.array(trajectory)

    # =========================================================
    # ONLINE SIMULATION
    # =========================================================
    def run_until(self, initial_state: np.ndarray, shock_fn, steps: int = 10):
        state = np.asarray(initial_state, dtype=float)
        trajectory = [state.copy()]

        for t in range(steps):
            shock = shock_fn(t, state)
            state = self.step(state, shock)
            trajectory.append(state.copy())

        return np.array(trajectory)

    # =========================================================
    # VALIDATION
    # =========================================================
    def _validate_matrix(self):
        if self.A.ndim != 2:
            raise ValueError("System matrix must be 2D")

        if self.A.shape[0] != self.A.shape[1]:
            raise ValueError("System matrix must be square")