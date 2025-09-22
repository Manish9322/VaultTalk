
"use client";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
      <div 
        className={cn(
          "grid h-screen w-full overflow-hidden",
          isSidebarCollapsed ? "md:grid-cols-[80px_1fr]" : "md:grid-cols-[280px_1fr]"
        )}
      >
        <div className="hidden border-r bg-muted/40 md:block">
          <AdminSidebar isCollapsed={isSidebarCollapsed} onCollapse={setIsSidebarCollapsed} />
        </div>
        <div className="flex flex-col">
          <AdminHeader onCollapse={setIsSidebarCollapsed} />
          <main className="flex flex-1 flex-col overflow-auto bg-muted/40">
            {children}
          </main>
        </div>
      </div>
  );
}
