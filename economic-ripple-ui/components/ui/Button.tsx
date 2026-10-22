import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors";
  const styles =
    variant === "primary"
      ? "bg-black text-white hover:bg-zinc-800"
      : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200";

  return <button className={`${base} ${styles} ${className ?? ""}`} {...props} />;
}
