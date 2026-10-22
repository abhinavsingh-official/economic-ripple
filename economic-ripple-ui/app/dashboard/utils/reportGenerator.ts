import type { SimulationDataRow, SimulationResult } from "@/lib/types";

// ─── Internal constants (self-contained, no cross-imports) ────────────────────

const VAR_LABELS: Record<string, string> = {
  gdp_growth: "GDP Growth",
  inflation: "Inflation",
  unemployment_rate: "Unemployment",
  poverty_rate: "Poverty Rate",
  depression_prev: "Mental Health",
  urbanization: "Urbanization",
  homicide_rate: "Crime Rate",
};

const VAR_COLORS: Record<string, string> = {
  gdp_growth: "#E8541C",
  inflation: "#DC2626",
  unemployment_rate: "#D97706",
  poverty_rate: "#7C3AED",
  depression_prev: "#6B7280",
  urbanization: "#16A34A",
  homicide_rate: "#374151",
};

const ALL_VARS = [
  "gdp_growth",
  "inflation",
  "unemployment_rate",
  "poverty_rate",
  "depression_prev",
  "urbanization",
  "homicide_rate",
];

const COUNTRY_COLORS = [
  "#E8541C", "#2563EB", "#16A34A", "#DC2626", "#7C3AED",
  "#D97706", "#0891B2", "#BE185D", "#059669", "#92400E",
  "#065F46", "#1D4ED8", "#991B1B", "#5B21B6", "#B45309",
];

const SCENARIO_DESCRIPTIONS: Record<string, string> = {
  recession:
    "Economic contraction with rising unemployment, falling output, and reduced consumer spending.",
  boom: "Rapid growth phase with surging GDP, inflationary pressure, and high consumption.",
  stagflation:
    "The worst of both worlds — stagnant growth combined with persistent high inflation.",
  social_crisis:
    "Societal instability marked by rising crime, mental health deterioration, and poverty expansion.",
  recovery:
    "Post-shock normalization as economic fundamentals stabilize and indicators return to trend.",
};

const SCENARIO_NAMES: Record<string, string> = {
  recession: "Recession",
  boom: "Economic Boom",
  stagflation: "Stagflation",
  social_crisis: "Social Crisis",
  recovery: "Recovery",
};

// ─── Types ─────────────────────────────────────────────────────────────────────

export type ReportInput = {
  result: SimulationResult;
  selectedCountries: string[];
  selectedScenarioId: string;
  steps: number;
  manualShocks: Record<string, number>;
};

// ─── SVG Chart Helper ──────────────────────────────────────────────────────────

function buildSvgChart(
  data: SimulationDataRow[],
  countries: string[],
  varKey: string
): string {
  const W = 560;
  const H = 110;
  const pad = { t: 6, r: 10, b: 22, l: 44 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;

  const relevantRows = data.filter((r) => countries.includes(r.country as string));
  const vals = relevantRows.map((r) => r[varKey] as number);
  const minV = vals.length ? Math.min(...vals) : 0;
  const maxV = vals.length ? Math.max(...vals) : 1;
  const range = maxV - minV || 1;
  const totalSteps = Math.max(...data.map((r) => r.step), 1);

  const xOf = (step: number) => pad.l + (step / totalSteps) * innerW;
  const yOf = (v: number) => pad.t + innerH - ((v - minV) / range) * innerH;

  // Gridlines at 0%, 25%, 50%, 75%, 100%
  let gridlines = "";
  for (let i = 0; i <= 4; i++) {
    const y = pad.t + (i / 4) * innerH;
    gridlines += `<line x1="${pad.l}" y1="${y.toFixed(1)}" x2="${W - pad.r}" y2="${y.toFixed(1)}" stroke="#EDE9E4" stroke-width="1"/>`;
  }

  // Y-axis labels: min, mid, max
  const yLabels = [
    { v: maxV, y: pad.t },
    { v: (minV + maxV) / 2, y: pad.t + innerH / 2 },
    { v: minV, y: pad.t + innerH },
  ];
  let yAxisLabels = "";
  for (const { v, y } of yLabels) {
    yAxisLabels += `<text x="${pad.l - 4}" y="${(y + 4).toFixed(1)}" text-anchor="end" font-size="9" fill="#A09890">${v.toFixed(1)}</text>`;
  }

  // X-axis labels: t0, t(half), tN
  const xLabels = [
    { label: "t0", step: 0 },
    { label: `t${Math.round(totalSteps / 2)}`, step: Math.round(totalSteps / 2) },
    { label: `t${totalSteps}`, step: totalSteps },
  ];
  let xAxisLabels = "";
  for (const { label, step } of xLabels) {
    const x = xOf(step);
    xAxisLabels += `<text x="${x.toFixed(1)}" y="${(H - 4).toFixed(1)}" text-anchor="middle" font-size="9" fill="#A09890">${label}</text>`;
  }

  // Polylines per country
  let polylines = "";
  countries.forEach((country, idx) => {
    const countryRows = relevantRows
      .filter((r) => r.country === country)
      .sort((a, b) => a.step - b.step);
    if (countryRows.length < 2) return;
    const points = countryRows
      .map((r) => `${xOf(r.step).toFixed(1)},${yOf(r[varKey] as number).toFixed(1)}`)
      .join(" ");
    const color = COUNTRY_COLORS[idx % COUNTRY_COLORS.length];
    polylines += `<polyline points="${points}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" style="display:block;max-width:100%;">
    ${gridlines}
    ${yAxisLabels}
    ${xAxisLabels}
    ${polylines}
  </svg>`;
}

// ─── Data Helpers ──────────────────────────────────────────────────────────────

function fmt(n: number, decimals = 2): string {
  return n.toFixed(decimals);
}

function fmtDelta(n: number, decimals = 2): string {
  return (n >= 0 ? "+" : "") + n.toFixed(decimals);
}

function getTrendArrow(delta: number): string {
  if (delta > 0.01) return "&#9650; Rising";
  if (delta < -0.01) return "&#9660; Falling";
  return "&rarr; Stable";
}

function getCountryRowsAtStep(
  data: SimulationDataRow[],
  countries: string[],
  step: number
): SimulationDataRow[] {
  return countries
    .map(
      (c) =>
        data.find((r) => r.country === c && r.step === step) ??
        data.filter((r) => r.country === c).sort((a, b) => b.step - a.step)[0]
    )
    .filter(Boolean) as SimulationDataRow[];
}

// ─── Section Builders ──────────────────────────────────────────────────────────

function buildHeader(
  scenarioName: string,
  countries: string[],
  steps: number,
  generatedDate: string
): string {
  const chips = [
    { label: "Scenario", value: scenarioName },
    { label: "Countries", value: `${countries.length} selected` },
    { label: "Steps", value: `${steps} time steps` },
    { label: "Variables", value: "7 variables" },
  ]
    .map(
      (c) =>
        `<div class="meta-chip"><span class="chip-label">${c.label}</span><span class="chip-value">${c.value}</span></div>`
    )
    .join("");

  return `
<div class="report-header">
  <div class="brand-label">Economic Ripple &middot; Simulation Report</div>
  <h1 class="report-title">Analysis: ${scenarioName} Scenario</h1>
  <div class="report-date">Generated ${generatedDate}</div>
  <div class="meta-chips">${chips}</div>
</div>`;
}

function buildExecutiveSummary(
  data: SimulationDataRow[],
  countries: string[],
  steps: number
): string {
  const maxStep = Math.max(...data.map((r) => r.step));
  const minStep = Math.min(...data.map((r) => r.step));

  const finalRows = getCountryRowsAtStep(data, countries, maxStep);
  const firstRows = getCountryRowsAtStep(data, countries, minStep);

  // GDP ranking
  const sorted = [...finalRows].sort(
    (a, b) => (b.gdp_growth as number) - (a.gdp_growth as number)
  );
  const highestGdp = sorted[0];
  const lowestGdp = sorted[sorted.length - 1];
  const gdpFinding =
    highestGdp && lowestGdp && highestGdp.country !== lowestGdp.country
      ? `<strong>${highestGdp.country}</strong> recorded the highest final GDP growth at <strong>${fmt(highestGdp.gdp_growth as number)}%</strong>, while <strong>${lowestGdp.country}</strong> posted the lowest at <strong>${fmt(lowestGdp.gdp_growth as number)}%</strong>.`
      : highestGdp
      ? `<strong>${highestGdp.country}</strong> recorded the highest final GDP growth at <strong>${fmt(highestGdp.gdp_growth as number)}%</strong>.`
      : "Insufficient data to rank GDP growth across countries.";

  // Unemployment change
  const unempDeltas = countries.map((c) => {
    const start = firstRows.find((r) => r.country === c);
    const end = finalRows.find((r) => r.country === c);
    const delta =
      start && end
        ? (end.unemployment_rate as number) - (start.unemployment_rate as number)
        : 0;
    return { country: c, delta };
  });
  const biggestUnempChange = unempDeltas.reduce(
    (prev, cur) => (Math.abs(cur.delta) > Math.abs(prev.delta) ? cur : prev),
    unempDeltas[0] ?? { country: "—", delta: 0 }
  );
  const unempFinding = biggestUnempChange
    ? `<strong>${biggestUnempChange.country}</strong> experienced the largest unemployment shift — <strong>${fmtDelta(biggestUnempChange.delta)} pp</strong> from simulation start to end.`
    : "Unemployment data unavailable.";

  // Inflation range
  const inflations = finalRows.map((r) => r.inflation as number);
  const inflMin = inflations.length ? Math.min(...inflations) : 0;
  const inflMax = inflations.length ? Math.max(...inflations) : 0;
  const inflFinding = `Final-step inflation ranged from <strong>${fmt(inflMin)}%</strong> to <strong>${fmt(inflMax)}%</strong> across all simulated countries.`;

  // Poverty rate shift
  const povertyDeltas = countries.map((c) => {
    const start = firstRows.find((r) => r.country === c);
    const end = finalRows.find((r) => r.country === c);
    return start && end ? (end.poverty_rate as number) - (start.poverty_rate as number) : 0;
  });
  const avgPoverty =
    povertyDeltas.length ? povertyDeltas.reduce((a, b) => a + b, 0) / povertyDeltas.length : 0;
  const povertyDir = avgPoverty > 0 ? "increased" : avgPoverty < 0 ? "decreased" : "remained stable";
  const povertyFinding = `Average poverty rate <strong>${povertyDir}</strong> by <strong>${Math.abs(avgPoverty).toFixed(2)} pp</strong> on average across all countries over ${steps} steps.`;

  const findings = [gdpFinding, unempFinding, inflFinding, povertyFinding]
    .map((f) => `<li>${f}</li>`)
    .join("");

  return `
<div class="section">
  <div class="section-title">Executive Summary</div>
  <ul class="findings">${findings}</ul>
</div>`;
}

function buildConfiguration(
  scenarioId: string,
  scenarioName: string,
  countries: string[],
  steps: number,
  manualShocks: Record<string, number>
): string {
  const description =
    SCENARIO_DESCRIPTIONS[scenarioId] ?? "Custom simulation configuration.";

  // Manual shocks
  const nonZeroShocks = Object.entries(manualShocks).filter(([, v]) => v !== 0);
  const shockContent =
    nonZeroShocks.length === 0
      ? `<span class="muted">No manual shocks applied.</span>`
      : nonZeroShocks
          .map(
            ([k, v]) =>
              `<div class="shock-row"><span class="shock-var">${VAR_LABELS[k] ?? k}</span><span class="shock-val" style="color:${v >= 0 ? "#16A34A" : "#DC2626"}">${v >= 0 ? "+" : ""}${v.toFixed(3)}</span></div>`
          )
          .join("");

  // Country pills
  const countryPills = countries
    .map((c, i) => {
      const col = COUNTRY_COLORS[i % COUNTRY_COLORS.length];
      return `<span class="country-pill"><span class="country-dot" style="background:${col}"></span>${c}</span>`;
    })
    .join("");

  return `
<div class="section">
  <div class="section-title">Simulation Configuration</div>
  <div class="config-grid">
    <div class="config-card">
      <div class="config-card-title">Scenario</div>
      <div class="config-scenario-name">${scenarioName}</div>
      <div class="config-scenario-desc">${description}</div>
    </div>
    <div class="config-card">
      <div class="config-card-title">Manual Shocks</div>
      <div class="shock-list">${shockContent}</div>
      <div class="muted" style="margin-top:8px;font-size:11px;">Additive on top of scenario vector at each step.</div>
    </div>
    <div class="config-card">
      <div class="config-card-title">Countries Modeled</div>
      <div class="country-pills">${countryPills}</div>
    </div>
    <div class="config-card">
      <div class="config-card-title">Model Architecture</div>
      <div class="arch-text">System Dynamics &middot; Linear State-Space</div>
      <div class="arch-formula">x(t+1) = A&middot;x(t) + &sigma; + &epsilon;</div>
      <div class="arch-meta">7&times;7 interaction matrix &middot; ${steps} time steps &middot; Countries run independently</div>
    </div>
  </div>
</div>`;
}

function buildVariableAnalysis(
  data: SimulationDataRow[],
  countries: string[]
): string {
  const maxStep = Math.max(...data.map((r) => r.step));
  const minStep = Math.min(...data.map((r) => r.step));

  const sections = ALL_VARS.map((varKey) => {
    const color = VAR_COLORS[varKey] ?? "#374151";
    const label = VAR_LABELS[varKey] ?? varKey;
    const chart = buildSvgChart(data, countries, varKey);

    // Table rows
    const tableRows = countries
      .map((country) => {
        const startRow = data.find((r) => r.country === country && r.step === minStep);
        const endRow = data.find((r) => r.country === country && r.step === maxStep);
        if (!startRow || !endRow) return "";
        const start = startRow[varKey] as number;
        const end = endRow[varKey] as number;
        const delta = end - start;
        const trend = getTrendArrow(delta);
        return `<tr>
          <td>${country}</td>
          <td>${fmt(start)}</td>
          <td>${fmt(end)}</td>
          <td style="color:${delta >= 0 ? "#16A34A" : "#DC2626"}">${fmtDelta(delta)}</td>
          <td>${trend}</td>
        </tr>`;
      })
      .join("");

    return `
<div class="section var-section">
  <div class="var-section-header" style="border-left:4px solid ${color};">
    <span class="var-label" style="color:${color}">${label}</span>
  </div>
  <div class="chart-container">${chart}</div>
  <table class="data-table">
    <thead>
      <tr>
        <th>Country</th>
        <th>Start (t0)</th>
        <th>End (tN)</th>
        <th>Delta</th>
        <th>Trend</th>
      </tr>
    </thead>
    <tbody>${tableRows}</tbody>
  </table>
</div>`;
  });

  return `
<div class="section">
  <div class="section-title">Variable Analysis</div>
  <div class="var-intro muted">Line charts show all selected countries across the simulation horizon. Table shows start/end values and net change per country.</div>
</div>
${sections.join("\n")}`;
}

function buildCountryProfiles(
  data: SimulationDataRow[],
  countries: string[]
): string {
  const maxStep = Math.max(...data.map((r) => r.step));
  const minStep = Math.min(...data.map((r) => r.step));

  const cards = countries
    .map((country, idx) => {
      const color = COUNTRY_COLORS[idx % COUNTRY_COLORS.length];
      const startRow = data.find((r) => r.country === country && r.step === minStep);
      const endRow = data.find((r) => r.country === country && r.step === maxStep);
      if (!startRow || !endRow) return "";

      const rows = ALL_VARS.map((varKey) => {
        const start = startRow[varKey] as number;
        const end = endRow[varKey] as number;
        const delta = end - start;
        return `<tr>
          <td>${VAR_LABELS[varKey]}</td>
          <td>${fmt(start)}</td>
          <td>${fmt(end)}</td>
          <td style="color:${delta >= 0 ? "#16A34A" : "#DC2626"}">${fmtDelta(delta)}</td>
        </tr>`;
      }).join("");

      return `
<div class="country-card">
  <div class="country-card-header">
    <span class="country-dot" style="background:${color};width:10px;height:10px;border-radius:50%;display:inline-block;margin-right:8px;"></span>
    <span class="country-card-name">${country}</span>
  </div>
  <table class="data-table">
    <thead>
      <tr><th>Variable</th><th>Start</th><th>End</th><th>&Delta; Change</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</div>`;
    })
    .join("");

  return `
<div class="section">
  <div class="section-title">Country Profiles</div>
  <div class="country-grid">${cards}</div>
</div>`;
}

function buildFooter(): string {
  return `
<div class="report-footer">
  <span>Economic Ripple &middot; System-Dynamics Macroeconomic Simulation</span>
  <span class="footer-divider">&middot;</span>
  <span>This report does not constitute financial advice.</span>
</div>`;
}

// ─── CSS ────────────────────────────────────────────────────────────────────────

function buildStyles(): string {
  return `
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    background: #F7F5F3;
    color: #344054;
    font-size: 13px;
    line-height: 1.5;
    padding: 0;
    margin: 0;
  }

  .page-wrap {
    max-width: 860px;
    margin: 0 auto;
    padding: 0 0 48px 0;
  }

  /* ── Header ── */
  .report-header {
    background: linear-gradient(135deg, #1A0A04 0%, #2D1208 100%);
    padding: 48px 40px 36px;
    color: #fff;
    margin-bottom: 24px;
  }
  .brand-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #E8541C;
    margin-bottom: 12px;
  }
  .report-title {
    font-size: 26px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 8px;
    letter-spacing: -0.01em;
  }
  .report-date {
    font-size: 12px;
    color: #A09890;
    margin-bottom: 24px;
  }
  .meta-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .meta-chip {
    display: inline-flex;
    flex-direction: column;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 8px;
    padding: 8px 14px;
    min-width: 130px;
  }
  .chip-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #A09890;
    margin-bottom: 2px;
  }
  .chip-value {
    font-size: 13px;
    font-weight: 600;
    color: #fff;
  }

  /* ── Sections ── */
  .section {
    background: #fff;
    border: 1px solid #EDE9E4;
    border-radius: 12px;
    padding: 24px;
    margin: 0 24px 20px;
  }
  .section-title {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #A09890;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #EDE9E4;
  }

  /* ── Executive Summary ── */
  .findings {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .findings li {
    border-left: 3px solid #E8541C;
    background: #FAF8F6;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 13px;
    line-height: 1.55;
    color: #344054;
  }

  /* ── Configuration ── */
  .config-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .config-card {
    background: #FAF8F6;
    border: 1px solid #EDE9E4;
    border-radius: 10px;
    padding: 16px;
  }
  .config-card-title {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #A09890;
    margin-bottom: 10px;
  }
  .config-scenario-name {
    font-size: 16px;
    font-weight: 700;
    color: #1A1614;
    margin-bottom: 6px;
  }
  .config-scenario-desc {
    font-size: 12px;
    color: #6B6560;
    line-height: 1.5;
  }
  .shock-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .shock-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
  }
  .shock-var { color: #344054; }
  .shock-val { font-weight: 700; font-family: monospace; }
  .country-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .country-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #fff;
    border: 1px solid #EDE9E4;
    border-radius: 20px;
    padding: 3px 10px 3px 6px;
    font-size: 12px;
    color: #344054;
  }
  .country-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
    flex-shrink: 0;
  }
  .arch-text {
    font-size: 13px;
    font-weight: 600;
    color: #344054;
    margin-bottom: 6px;
  }
  .arch-formula {
    font-family: monospace;
    font-size: 13px;
    color: #E8541C;
    background: rgba(232,84,28,0.06);
    border-radius: 6px;
    padding: 6px 10px;
    margin-bottom: 8px;
    display: inline-block;
  }
  .arch-meta {
    font-size: 11px;
    color: #6B6560;
  }

  /* ── Variable Analysis ── */
  .var-intro {
    font-size: 12px;
    line-height: 1.5;
    margin-top: -4px;
  }
  .var-section-header {
    padding: 10px 14px;
    background: #FAF8F6;
    border-radius: 8px;
    margin-bottom: 14px;
  }
  .var-label {
    font-size: 13px;
    font-weight: 700;
  }
  .chart-container {
    margin-bottom: 14px;
    overflow-x: auto;
  }

  /* ── Tables ── */
  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }
  .data-table thead tr {
    background: #FAF8F6;
  }
  .data-table th {
    text-align: left;
    padding: 8px 10px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #A09890;
    border-bottom: 1px solid #EDE9E4;
  }
  .data-table td {
    padding: 8px 10px;
    color: #344054;
    border-bottom: 1px solid #F3F0ED;
  }
  .data-table tbody tr:last-child td {
    border-bottom: none;
  }
  .data-table tbody tr:hover {
    background: #FAF8F6;
  }

  /* ── Country Profiles ── */
  .country-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .country-card {
    border: 1px solid #EDE9E4;
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
  }
  .country-card-header {
    padding: 12px 14px;
    background: #FAF8F6;
    border-bottom: 1px solid #EDE9E4;
    display: flex;
    align-items: center;
  }
  .country-card-name {
    font-size: 14px;
    font-weight: 700;
    color: #1A1614;
  }

  /* ── Footer ── */
  .report-footer {
    text-align: center;
    padding: 24px 40px;
    font-size: 11px;
    color: #A09890;
    border-top: 1px solid #EDE9E4;
    margin: 24px 24px 0;
    display: flex;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .footer-divider { color: #C9C0BB; }

  /* ── Utility ── */
  .muted { color: #A09890; }

  /* ── Print ── */
  @media print {
    body { background: #fff; }
    .section, .country-card, .config-card, .var-section { break-inside: avoid; }
    .report-header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style>`;
}

// ─── Main Export ───────────────────────────────────────────────────────────────

export function generateHtmlReport(input: ReportInput): string {
  const { result, selectedCountries, selectedScenarioId, steps, manualShocks } = input;
  const { data } = result;

  const scenarioName =
    SCENARIO_NAMES[selectedScenarioId] ??
    (selectedScenarioId
      ? selectedScenarioId.charAt(0).toUpperCase() + selectedScenarioId.slice(1)
      : "Custom");

  const generatedDate = new Date().toLocaleString();

  const header = buildHeader(scenarioName, selectedCountries, steps, generatedDate);
  const summary = buildExecutiveSummary(data, selectedCountries, steps);
  const config = buildConfiguration(
    selectedScenarioId,
    scenarioName,
    selectedCountries,
    steps,
    manualShocks
  );
  const varAnalysis = buildVariableAnalysis(data, selectedCountries);
  const countryProfiles = buildCountryProfiles(data, selectedCountries);
  const footer = buildFooter();
  const styles = buildStyles();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Economic Ripple · ${scenarioName} Scenario Report</title>
  ${styles}
</head>
<body>
  <div class="page-wrap">
    ${header}
    ${summary}
    ${config}
    ${varAnalysis}
    ${countryProfiles}
    ${footer}
  </div>
</body>
</html>`;
}
