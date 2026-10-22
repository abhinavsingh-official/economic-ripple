import Link from "next/link";

export function Navbar() {
  return (
    <header className="w-full border-b border-[#EDE9E4] bg-white shadow-sm">
      <div className="flex h-14 items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-sm font-bold text-[#1A1614] tracking-tight"
        >
          <span
            className="flex h-7 w-7 items-center justify-center rounded-lg text-white text-xs font-bold"
            style={{ background: "linear-gradient(135deg, #F97316 0%, #E8541C 100%)" }}
          >
            ER
          </span>
          Economic Ripple
        </Link>

        <div className="flex items-center gap-3 text-xs text-[#6B6560]">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
            <span className="font-medium text-[#16A34A]">Healthy</span>
          </span>
          <div className="h-4 w-px bg-[#EDE9E4]" />
          <Link
            href="/"
            className="rounded-lg border border-[#EDE9E4] px-3 py-1.5 text-[#6B6560] hover:bg-[#FAF8F6] hover:text-[#1A1614] transition-all"
          >
            ← Home
          </Link>
        </div>
      </div>
    </header>
  );
}
