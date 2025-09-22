import { ProtectedRoute } from "@/components/protected-route";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PanelLeft, LogOut, User as UserIcon } from "lucide-react";
import { Logo } from "@/components/logo";
import { useAuth } from "@/hooks/use-auth";
import { AdminHeader } from "@/components/admin/admin-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute adminOnly={true}>
      <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <AdminSidebar />
        </div>
        <div className="flex flex-col">
          <AdminHeader />
          <main className="flex flex-1 flex-col overflow-auto bg-muted/40">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
