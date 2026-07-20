"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "./admin-sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <div className="min-h-screen flex items-center justify-center">{children}</div>;
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
