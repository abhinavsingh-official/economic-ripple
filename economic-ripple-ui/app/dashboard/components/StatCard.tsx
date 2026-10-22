"use client";

type StatCardProps = {
  label: string;
  value: string;
  unit?: string;
  delta?: number;
  accentColor?: string;
};

export function StatCard({ label, value, unit, delta, accentColor = "#E8541C" }: StatCardProps) {
  const hasResult = value !== "—";
  const positive = delta !== undefined && delta > 0;
  const negative = delta !== undefined && delta < 0;

  return (
    <div className="bg-white rounded-2xl border border-[#EDE9E4] p-5 flex flex-col gap-2 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#A09890]">
          {label}
        </span>
        <span
          className="w-2 h-2 rounded-full transition-colors"
          style={{ backgroundColor: hasResult ? accentColor : "#EDE9E4" }}
        />
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-[#1A1614]">{value}</span>
        {unit && <span className="text-sm text-[#A09890]">{unit}</span>}
      </div>

      {delta !== undefined ? (
        <div
          className={`flex items-center gap-1 text-xs font-semibold ${
            positive ? "text-[#16A34A]" : negative ? "text-[#DC2626]" : "text-[#A09890]"
          }`}
        >
          <span>{positive ? "▲" : negative ? "▼" : "—"}</span>
          <span>{Math.abs(delta).toFixed(4)}</span>
          <span className="font-normal text-[#A09890]">from baseline</span>
        </div>
      ) : (
        <div className="text-xs text-[#C4BBB4]">Run simulation to populate</div>
      )}
    </div>
  );
}
