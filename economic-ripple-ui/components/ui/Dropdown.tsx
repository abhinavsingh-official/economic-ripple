import * as React from "react";

type Option = { value: string; label: string };

type DropdownProps = {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
};

export function Dropdown({ label, value, options, onChange }: DropdownProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
      <select
        className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-800 dark:bg-zinc-950"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
