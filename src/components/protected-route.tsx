
"use client";

import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (adminOnly) {
      const token = localStorage.getItem('vault-admin-token');
      // In a real app, you'd verify the token with a backend.
      // Here, we just check for its presence.
      if (token) {
        setIsAdminAuthenticated(true);
      } else {
        router.push('/admin');
        return;
      }
    } else {
        if (!user) {
            router.push('/login');
            return;
        }
    }
  }, [isLoading, user, router, adminOnly]);

  if (isLoading || (!user && !adminOnly) || (adminOnly && !isAdminAuthenticated)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }


  return <>{children}</>;
}
