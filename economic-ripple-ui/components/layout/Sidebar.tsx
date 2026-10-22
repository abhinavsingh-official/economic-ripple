import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="hidden w-56 flex-shrink-0 border-r border-[#E4E7EC] bg-white p-4 md:block">
      <div className="text-xs font-semibold uppercase tracking-widest text-[#98A2B3]">
        Navigation
      </div>
      <nav className="mt-3 flex flex-col gap-1 text-sm">
        <Link
          href="/dashboard"
          className="rounded-md px-3 py-2 font-medium text-[#344054] hover:bg-[#F9FAFB] transition-colors"
        >
          Dashboard
        </Link>
      </nav>
    </aside>
  );
}
