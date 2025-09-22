
"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PanelLeft, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AdminSidebar } from "./admin-sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ThemeToggle } from "../theme-toggle";

export function AdminHeader({ onCollapse }: { onCollapse: (collapsed: boolean) => void }) {
    const { user, logout } = useAuth();
    
    const getAvatarUrl = (avatarId: string) => {
        return PlaceHolderImages.find(img => img.id === avatarId)?.imageUrl;
    }

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4">
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button size="icon" variant="outline">
                        <PanelLeft className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 sm:max-w-xs">
                        <AdminSidebar isCollapsed={false} onCollapse={onCollapse} />
                    </SheetContent>
                </Sheet>
            </div>
            <div className="flex-1">
                {/* Optional: Add breadcrumbs or page title here */}
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={getAvatarUrl(user?.avatar || '')} alt={user?.name} />
                            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                     <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                           <ThemeToggle />
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
