"use client";

import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { LogOut, Home, Users, BarChart, Settings, Activity } from "lucide-react";
import { Logo } from "../logo";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

const navLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/activities", label: "Activities", icon: Activity },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart },
    { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function AdminSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <div className="flex h-full max-h-screen flex-col">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Logo />
      </div>
      <div className="flex-1 overflow-auto">
        <nav className="grid items-start p-2 text-sm font-medium lg:p-4">
            {navLinks.map((link) => (
                <Link key={link.href} href={link.href} passHref>
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start gap-3 my-1",
                            pathname === link.href && "bg-accent text-accent-foreground"
                        )}
                    >
                        <link.icon className="h-5 w-5" />
                        <span>{link.label}</span>
                    </Button>
              </Link>
            ))}
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        <Button variant="ghost" onClick={logout} className="w-full justify-start gap-3">
            <LogOut className="h-5 w-5" />
            <span>Log out</span>
        </Button>
      </div>
    </div>
  );
}
