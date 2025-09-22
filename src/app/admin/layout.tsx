import { ProtectedRoute } from "@/components/protected-route";
import { AppSidebar } from "@/components/chat/app-sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";
import { Logo } from "@/components/logo";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <AppSidebar />
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 sm:max-w-xs">
                <AppSidebar />
              </SheetContent>
            </Sheet>
            <Logo />
          </header>
          <main className="flex flex-1 flex-col overflow-auto bg-muted/40">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
