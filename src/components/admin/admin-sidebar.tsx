
"use client";

import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { LogOut, Home, Users, BarChart, Settings, Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { Logo } from "../logo";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { useState } from "react";

const navLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/activities", label: "Activities", icon: Activity },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart },
    { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function AdminSidebar({ isCollapsed, onCollapse }: { isCollapsed: boolean, onCollapse: (collapsed: boolean) => void }) {
  const { logout } = useAuth();
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  return (
    <TooltipProvider>
      <div className="flex h-full max-h-screen flex-col relative">
        <div className={cn(
            "flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6",
            !isCollapsed && "justify-start",
            isCollapsed && "justify-center"
          )}
        >
          {!isCollapsed ? <Logo /> : <Users className="h-6 w-6"/>}
        </div>

        <Button 
          variant="outline" 
          size="icon" 
          className="absolute -right-4 top-14 z-10 hidden md:inline-flex"
          onClick={() => onCollapse(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>

        <div className="flex-1 overflow-auto">
          <nav className="grid items-start p-2 text-sm font-medium lg:p-4">
              {navLinks.map((link) => (
                <Tooltip key={link.href} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link href={link.href} passHref>
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-3 my-1",
                                pathname === link.href && "bg-accent text-accent-foreground",
                                isCollapsed && "justify-center"
                            )}
                        >
                            <link.icon className="h-5 w-5" />
                            {!isCollapsed && <span>{link.label}</span>}
                        </Button>
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">
                      <p>{link.label}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
          </nav>
        </div>
        <div className="mt-auto border-t p-4">
          <AlertDialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" className={cn(
                    "w-full justify-start gap-3",
                    isCollapsed && "justify-center"
                  )}>
                      <LogOut className="h-5 w-5" />
                      {!isCollapsed && <span>Log out</span>}
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  <p>Log out</p>
                </TooltipContent>
              )}
            </Tooltip>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will be returned to the login screen.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={logout}>Log Out</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </TooltipProvider>
  );
}
