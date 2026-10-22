import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-[#FAF8F6] overflow-hidden">
      <Navbar />
      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
    </div>
  );
}
