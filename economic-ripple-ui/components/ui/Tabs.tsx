import * as React from "react";

export type Tab = { id: string; label: string };

type TabsProps = {
  tabs: Tab[];
  activeId: string;
  onChange: (id: string) => void;
};

export function Tabs({ tabs, activeId, onChange }: TabsProps) {
  return (
    <div className="flex gap-2">
      {tabs.map((t) => {
        const active = t.id === activeId;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={`h-9 rounded-md px-3 text-sm font-medium transition-colors ${
              active
                ? "bg-black text-white"
                : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
