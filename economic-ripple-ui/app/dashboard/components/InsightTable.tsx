"use client";

import { useSimulationStore } from "../store/simulationStore";

export function InsightTable() {
  const { insights, error, isLoading } = useSimulationStore();

  return (
    <div className="bg-white rounded-2xl border border-[#EDE9E4] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-semibold text-[#1A1614]">Variable Insights</div>
          <div className="text-xs text-[#6B6560] mt-0.5">
            End-state values vs. baseline for selected country
          </div>
        </div>
        {error && (
          <div className="flex items-center gap-1.5 rounded-full bg-[#FEF2F2] border border-[#FECACA] px-3 py-1 text-xs font-medium text-[#DC2626]">
            {error}
          </div>
        )}
      </div>

      {insights.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF3EE] flex items-center justify-center">
            <svg className="w-5 h-5 text-[#E8541C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-sm font-semibold text-[#1A1614]">
            {isLoading ? "Running simulation…" : "No data yet"}
          </div>
          <div className="text-xs text-[#A09890]">
            Run a simulation to generate insights
          </div>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#F5F0EC]">
              <th className="pb-2 text-left text-xs font-semibold text-[#A09890]">Variable</th>
              <th className="pb-2 text-right text-xs font-semibold text-[#A09890]">End Value</th>
              <th className="pb-2 text-right text-xs font-semibold text-[#A09890]">Change</th>
            </tr>
          </thead>
          <tbody>
            {insights.map((insight) => {
              const positive = (insight.delta ?? 0) > 0;
              const negative = (insight.delta ?? 0) < 0;
              return (
                <tr key={insight.id} className="border-b border-[#FAF8F6] last:border-0">
                  <td className="py-2.5 font-medium text-[#1A1614]">{insight.title}</td>
                  <td className="py-2.5 text-right font-mono text-[#1A1614]">{insight.value}</td>
                  <td className="py-2.5 text-right">
                    <span
                      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        positive
                          ? "bg-[#F0FDF4] text-[#16A34A]"
                          : negative
                          ? "bg-[#FEF2F2] text-[#DC2626]"
                          : "bg-[#FAF8F6] text-[#A09890]"
                      }`}
                    >
                      {positive ? "▲" : negative ? "▼" : "—"}
                      {insight.delta !== undefined
                        ? Math.abs(insight.delta).toFixed(4)
                        : "0.0000"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
