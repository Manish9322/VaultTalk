"use client";

import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push(adminOnly ? '/admin' : '/login');
      return;
    }

    if (adminOnly && user.email !== 'admin@whisper.com') {
      router.push('/chat'); // or a dedicated "unauthorized" page
    }
    
  }, [isLoading, user, router, adminOnly]);

  if (isLoading || !user || (adminOnly && user.email !== 'admin@whisper.com')) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
