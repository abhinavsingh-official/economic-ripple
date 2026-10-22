"use client";

import type { CSSProperties, ReactNode } from "react";

type ChartCardProps = {
  title: string;
  subtitle?: string;
  headerRight?: ReactNode;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function ChartCard({ title, subtitle, headerRight, children, className = "", style }: ChartCardProps) {
  return (
    <div className={`bg-white rounded-xl border border-[#EDE9E4] p-4 shadow-sm flex flex-col ${className}`} style={style}>
      <div className="flex items-start justify-between mb-3 gap-2 shrink-0">
        <div>
          <div className="text-sm font-semibold text-[#1A1614]">{title}</div>
          {subtitle && (
            <div className="text-xs text-[#A09890] mt-0.5">{subtitle}</div>
          )}
        </div>
        {headerRight && <div className="shrink-0">{headerRight}</div>}
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}

export function ChartEmptyState({ message = "Run simulation to populate" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[120px] gap-2 text-center">
      <div className="w-9 h-9 rounded-xl bg-[#FFF3EE] flex items-center justify-center">
        <svg className="w-4 h-4 text-[#E8541C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4" />
        </svg>
      </div>
      <span className="text-xs text-[#A09890]">{message}</span>
    </div>
  );
}
