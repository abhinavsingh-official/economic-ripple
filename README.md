# Economic Ripple

An interactive macroeconomic "what-if" simulator. It models how a shock — recession,
boom, stagflation, social crisis, recovery — propagates through seven interdependent
variables (GDP growth, inflation, unemployment, poverty, urbanisation, depression
prevalence, homicide rate) across 26 countries, starting from each country's most
recent observed data point rather than a synthetic baseline.

It is a scenario explorer, not a forecasting tool: it shows the *shape* of a shock's
propagation and which countries/variables are structurally most exposed, not a
prediction of what will actually happen.

## What it does

- Pick one or more of 26 countries and a scenario (Recession, Boom, Stagflation,
  Social Crisis, Recovery), or compose manual per-variable shocks.
- Run a 5–100 step simulation and watch all seven variables evolve across ten
  synchronised chart types (line, area, radar, grouped bar, scatter, stacked area,
  shock-attribution bars, heatmap, sparklines).
- Scrub through time to inspect any single step.
- For any point on any chart, see the exact decomposition of *why* the value moved:
  how much came from the system's own structural dynamics, how much from the applied
  shock, and how much from stochastic noise. These three components sum exactly to the
  observed change — it's an algebraic identity, not an approximation, and it's checked
  against a 1e-6 tolerance at runtime.
- Export a self-contained `.html` report (inline SVG charts, no external dependencies,
  opens offline) with one click.

## Architecture

```
data/            Raw + processed World Bank / IHME / UNODC panel data,
                 per-variable cleaning scripts, the fitted matrix and
                 one-step-ahead predictions used as simulation baselines.

simulator/       WorldSimulator (top-level orchestrator: initialises each
                 country's state from the empirical baseline and runs the
                 update loop), ExplanationPipeline + ExplanationBuilder
                 (verifies and narrates the causal decomposition),
                 InsightEngine, ScenarioRunner, PlotEngine.

shock_engine/    Computes the total shock vector per step: scenario base
                 shock with geometric decay, manual overrides, and
                 scheduled timeline events.

backend/         FastAPI app (backend/main.py) wiring simulator + shock_engine
                 to a REST API: POST /api/simulate, plus /api/scenarios and
                 /api/insights routes. Loads the matrix once at startup into
                 an in-memory cache (backend/core/cache.py) — no per-request
                 file I/O.

economic-ripple-ui/   Next.js 16 / React 19 / TypeScript frontend. Zustand
                      store drives ten Recharts-based chart components, a
                      debounced auto-run on shock-slider changes, and a
                      time-scrubber for playback.

legacy/          Earlier Streamlit prototype of the same dashboard, kept for
                 reference — superseded by economic-ripple-ui/.
```

**Data flow for one simulation run:** user adjusts parameters in the dashboard →
debounced auto-run (or explicit Run) → `POST /api/simulate` → `WorldSimulator` steps
every selected country forward, applying the update equation + shock + noise at each
step → flat JSON array of per-step rows → Zustand store → all charts re-render.

## Modeling approach

The simulation engine is a linear discrete-time state-space model — a VAR(1)
(Vector Autoregression of order 1) with no intercept:

```
x(t+1) = A * x(t) + sigma(t) + epsilon(t)
```

- **x(t)** — a 7-dimensional state vector per country (depression_prev, gdp_growth,
  inflation, unemployment_rate, poverty_rate, urbanization, homicide_rate),
  initialised at `t=0` from the country's most recent real observed, normalised
  values.
- **A** — the 7x7 system matrix, estimated by OLS regression (one regression per
  target variable, `x_i(t+1)` on all seven current-step values) against a 202-row,
  26-country panel spanning 1994–2024. No regularisation: with 202 rows and 7
  predictors per regression the OLS problem is already well-determined, and Ridge/Lasso
  shrinkage would bias the diagonal persistence terms downward.
- **sigma(t)** — the applied shock, decaying geometrically: `base_shock * rho^t`,
  where `rho` is a scenario-specific persistence factor (0.50–0.90 across the five
  active scenarios).
- **epsilon(t)** — i.i.d. `N(0, 0.05)` noise per variable per step, seeded for
  reproducibility.

**Stability.** The spectral radius (largest eigenvalue magnitude) of the deployed
matrix is 0.9960 — just under 1, which guarantees the unshocked system converges back
to baseline, but implies a half-life of roughly 173 steps for a deviation to decay by
half. A dominant complex-conjugate eigenvalue pair produces oscillatory, overshoot-and-
settle dynamics rather than monotonic decay — consistent with real business-cycle
behavior.

**Causal decomposition.** Because the update equation is purely additive, every
variable's change at every step is exactly `system_delta + shock + noise`, with no
residual. This is what lets the frontend answer, for any point on any chart, "how much
of this was structure vs. shock vs. randomness" — exactly, not approximately.

Why linear VAR(1) instead of a neural net or DSGE model: with 202 training rows and 7
variables, a 49-parameter linear model is already a fairly constrained estimation
problem, and it comes with an analytical stability guarantee (spectral radius) that
a neural network doesn't provide. A DSGE model would need structurally calibrated
behavioral parameters (discount rates, price stickiness) that this panel can't
identify. Full reasoning, the complete matrix with row-by-row interpretation, and
estimation pipeline are in
[`information/Economic_Ripple_Complete_Documentation.pdf`](information/Economic_Ripple_Complete_Documentation.pdf).

## Running it

### Backend

```bash
python -m venv .venv
source .venv/bin/activate   # .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

Key dependencies (see `requirements.txt` for the full pinned list): `fastapi==0.111.0`,
`uvicorn[standard]==0.30.1`, `pydantic==2.7.4`, `pandas==2.2.2`, `numpy==1.26.4`,
`statsmodels==0.14.2`, `scikit-learn==1.3.0`.

The API serves on `http://localhost:8000` by default, with CORS configured for the
frontend at `http://localhost:3000`.

### Frontend

```bash
cd economic-ripple-ui
npm install
npm run dev
```

Opens on `http://localhost:3000`. Built on `next@16.2.4`, `react@19.2.4`,
`typescript@^5`, `zustand@^5.0.12`, `recharts@^3.8.1`, Tailwind CSS v4.

### Deployment

- **Backend** deploys to [Render](https://render.com) via the included `render.yaml` blueprint
  (free tier). Set `CORS_ALLOW_ORIGINS` to the deployed frontend's origin (e.g.
  `https://economic-ripple.vercel.app`) once that URL is known. Note: Render's free tier spins
  the service down after inactivity, so the first request after a cold start can take 30-60s.
- **Frontend** deploys to [Vercel](https://vercel.com) from `economic-ripple-ui/`. Set
  `NEXT_PUBLIC_API_BASE_URL` to the deployed backend's URL (e.g.
  `https://economic-ripple-backend.onrender.com`).

## Screenshots

_Drop dashboard screenshots in `docs/screenshots/` and reference them here, e.g._

```markdown
![Dashboard overview](docs/screenshots/dashboard.png)
![Shock attribution chart](docs/screenshots/attribution.png)
```

## Limitations

These are self-disclosed in the full technical documentation
(`information/Economic_Ripple_Complete_Documentation.pdf`, Sections 10–11):

- **No cross-country coupling.** Each country's 26 trajectories are computed
  independently; they only appear correlated because a shared scenario applies the
  same shock vector to all selected countries. A recession in one country does not
  reduce another's GDP through a trade channel.
- **One global matrix for 26 structurally different economies.** Jamaica's
  tourism-dependent economy and Germany's industrial export economy share the same
  7x7 system matrix. A country-specific matrix would be more accurate but isn't
  estimable from 202 training rows.
- **Linear dynamics can't capture regime shifts.** The matrix is fixed regardless of
  current state, so threshold effects — a debt-to-GDP ratio crossing 120%, a bank run,
  hyperinflation dynamics — aren't represented.
- **No formal out-of-sample validation.** The matrix was never evaluated on a held-out
  test period; validation was qualitative (sign-consistency with economic theory) and
  via spectral stability, not predictive accuracy.
- **Constant isotropic noise.** `N(0, 0.05)` is applied identically to all seven
  variables, even though GDP growth is empirically far more volatile year-to-year than
  urbanisation or depression prevalence.
- **Jamaica's homicide rate is an outlier that skews the matrix.** At 53.1 per 100,000
  it's roughly 10x the next-highest country in the panel, inflating that column's
  variance and likely distorting the homicide-related coefficients.
- Not a predictive model — valid interpretations are relative ("country A is more
  exposed to this shock than country B") and directional, never point forecasts.
- No confidence intervals on trajectories, no live/real-time data feed (data runs
  through ~2024), and the timeline API (scheduling different shocks at different
  steps) has no frontend UI yet.

## License

MIT — see [LICENSE](LICENSE).
