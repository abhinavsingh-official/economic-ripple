import Link from "next/link";

const COUNTRIES = [
  "Albania", "Argentina", "Australia", "Bangladesh", "Canada",
  "China", "Finland", "France", "Georgia", "Germany",
  "Iceland", "India", "Indonesia", "Israel", "Italy",
  "Jamaica", "Japan", "Philippines", "Poland", "Russia",
  "Spain", "Sri Lanka", "Sweden", "Switzerland", "Thailand", "Ukraine",
];

const COUNTRY_STYLES = [
  "bg-[#EFF4FF] border-[#C7D7FD] text-[#1570EF]",
  "bg-[#FEF3F2] border-[#FECDCA] text-[#D92D20]",
  "bg-white border-[#E4E7EC] text-[#344054]",
  "bg-[#F0FDF4] border-[#A7F3D0] text-[#067647]",
  "bg-[#FFFAEB] border-[#FEF0C7] text-[#B54708]",
];

const DATA_SOURCES = [
  {
    abbr: "WB",
    name: "World Bank",
    accent: "blue" as const,
    description:
      "Decades of macroeconomic indicators — GDP trajectories, trade flows, and inflation histories spanning over 180 nations form the empirical backbone of the simulation.",
  },
  {
    abbr: "IMF",
    name: "IMF Data",
    accent: "red" as const,
    description:
      "Fiscal balance sheets, monetary policy signals, and country risk profiles sourced directly from International Monetary Fund datasets.",
  },
  {
    abbr: "OE",
    name: "OECD Statistics",
    accent: "blue" as const,
    description:
      "Structural economic data covering employment patterns, productivity benchmarks, and long-run growth forecasts across member and partner economies.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen text-[#101828]" style={{ fontFamily: "var(--font-geist-sans, system-ui, sans-serif)" }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">

        {/* Background: placeholder image + gradient overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/hero-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1A0A04] via-[#2D1208] to-[#3D1F0D]" />

        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 z-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Glow accent */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 h-[600px] w-[600px] rounded-full bg-[#F97316] opacity-[0.12] blur-[140px] pointer-events-none" />

        {/* Minimal top nav */}
        <nav className="relative z-10 flex items-center justify-between px-8 py-6">
          <span className="text-white/80 text-sm font-bold tracking-tight">Economic Ripple</span>
          <Link
            href="/dashboard"
            className="text-xs text-white/50 hover:text-white/90 transition-colors"
          >
            Skip to dashboard →
          </Link>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center px-6 pb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 backdrop-blur-sm px-4 py-1.5 text-xs text-white/60 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F97316]" />
            Macroeconomic Simulation Platform
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-[80px] font-bold text-white leading-[1.05] tracking-tight max-w-3xl">
            Economic
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #F97316 0%, #FDBA74 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Ripple
            </span>
          </h1>

          <Link
            href="/dashboard"
            className="mt-10 inline-flex items-center gap-2.5 rounded-xl px-8 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #F97316 0%, #E8541C 100%)",
              boxShadow: "0 4px 24px rgba(232,84,28,0.45)",
            }}
          >
            Take me to the dashboard
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>

          <p className="mt-6 text-sm text-white/45 max-w-md leading-relaxed">
            Simulate how economic shocks travel across borders. Select a country, apply a scenario,
            and watch the ripple propagate through 26 interconnected economies in real time.
          </p>

          {/* Scroll cue */}
          <div className="absolute bottom-8 flex flex-col items-center gap-1.5 text-white/25 text-[11px]">
            <span>Explore below</span>
            <svg className="h-4 w-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── WHAT IT IS ───────────────────────────────────────────────────── */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-widest text-[#E8541C] mb-4">
            What this is
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#101828] leading-tight mb-6">
            One shock. Twenty-six economies. Infinite ripples.
          </h2>
          <p className="text-[#667085] leading-relaxed mb-4">
            Economic Ripple is a dynamic simulation engine built on a system-dynamics model of
            global trade and financial interdependence. When you trigger a scenario say, a
            supply shock in a major oil-producing nation the model propagates that shock
            through every bilateral trade link, currency exposure, and policy feedback loop
            in real time.
          </p>
          <p className="text-[#667085] leading-relaxed">
            What it will not do is predict the future. It is a structured what-if machine: it
            shows you the probable shape of a shock&apos;s path, the economies most exposed, and
            the variables most sensitive to change. The insight is in the pattern, not the precision.
          </p>
        </div>
      </section>

      {/* ── COVERAGE ─────────────────────────────────────────────────────── */}
      <section className="py-28 px-6 bg-[#F7F8FA]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-bold uppercase tracking-widest text-[#E8541C] mb-4">
              Coverage
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#101828]">
              Every major economic bloc. One model.
            </h2>
            <p className="mt-4 text-[#667085] max-w-lg mx-auto leading-relaxed">
              From G7 powerhouses to emerging market engines — the simulation spans the economies
              that collectively drive 85% of global capital flows and trade volumes.
            </p>
          </div>

          {/* Country mosaic — staggered, not a list */}
          <div className="flex flex-wrap justify-center gap-2">
            {COUNTRIES.map((country, i) => (
              <span
                key={country}
                className={`rounded-full border px-4 py-2 text-sm font-medium ${COUNTRY_STYLES[i % 5]}`}
              >
                {country}
              </span>
            ))}
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { number: "26", label: "Economies modeled" },
              { number: "7", label: "Economic variables" },
              { number: "5", label: "Shock scenarios" },
              { number: "∞", label: "Simulation configurations" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-6 bg-white rounded-xl border border-[#E4E7EC]"
              >
                <div className="text-4xl font-bold text-[#E8541C]">{stat.number}</div>
                <div className="mt-1.5 text-sm text-[#667085]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DATA SOURCES ─────────────────────────────────────────────────── */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-bold uppercase tracking-widest text-[#E8541C] mb-4">
              Data Foundation
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#101828]">
              Built on institutional-grade data
            </h2>
            <p className="mt-4 text-[#667085] max-w-md mx-auto leading-relaxed">
              The model is trained and calibrated against decades of longitudinal data from the
              world&apos;s most rigorous economic institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DATA_SOURCES.map((source) => (
              <div
                key={source.name}
                className="group p-8 rounded-2xl border border-[#E4E7EC] bg-[#F7F8FA] hover:border-[#E8541C]/40 hover:shadow-lg hover:shadow-[#E8541C]/5 transition-all"
              >
                <div
                  className={`w-11 h-11 rounded-xl mb-5 flex items-center justify-center text-sm font-bold ${
                    source.accent === "blue"
                      ? "bg-[#FFF3EE] text-[#E8541C]"
                      : "bg-[#FEF3F2] text-[#D92D20]"
                  }`}
                >
                  {source.abbr}
                </div>
                <div className="text-base font-semibold text-[#101828] mb-2">{source.name}</div>
                <p className="text-sm text-[#667085] leading-relaxed">{source.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ────────────────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: "linear-gradient(135deg, #1A0A04 0%, #2D1208 60%, #3D1F0D 100%)" }}>
        {/* Placeholder for background image */}
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url('/cta-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to run your first simulation?
          </h2>
          <p className="text-white/50 mb-8 text-sm leading-relaxed">
            Select a country, apply a shock scenario, and watch twenty-six economies respond
            in lockstep — or diverge in ways that might surprise you.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2.5 rounded-xl px-8 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, #1570EF 0%, #2563EB 100%)",
              boxShadow: "0 4px 24px rgba(21,112,239,0.40)",
            }}
          >
            Take me to the dashboard
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

    </div>
  );
}
