"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { users } from "@/lib/data";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { LogOut, Shield } from "lucide-react";
import { Logo } from "../logo";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";

export function AppSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const otherUsers = users.filter(u => u.id !== user?.id && u.id !== 'admin');

  const getAvatarUrl = (avatarId: string) => {
    return PlaceHolderImages.find(img => img.id === avatarId)?.imageUrl;
  }

  return (
    <div className="flex h-full max-h-screen flex-col">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Logo />
      </div>
      <ScrollArea className="flex-1">
        <nav className="grid items-start p-2 text-sm font-medium lg:p-4">
          <h3 className="px-2 py-2 text-xs font-semibold text-muted-foreground">Users</h3>
          {otherUsers.map((u) => (
            <Link key={u.id} href={`/chat/${u.id}`} passHref>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3",
                  pathname === `/chat/${u.id}` && "bg-accent text-accent-foreground"
                )}
              >
                <Avatar className="h-8 w-8 relative">
                  <AvatarImage src={getAvatarUrl(u.avatar)} alt={u.name} />
                  <AvatarFallback>{u.name.charAt(0)}</AvatarFallback>
                  {u.online && <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background"></span>}
                </Avatar>
                <span className="truncate">{u.name}</span>
              </Button>
            </Link>
          ))}
          {user?.email === 'admin@whisper.com' && (
            <>
              <h3 className="px-2 py-2 text-xs font-semibold text-muted-foreground mt-4">Admin</h3>
              <Link href="/admin" passHref>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3",
                    pathname === '/admin' && "bg-accent text-accent-foreground"
                  )}
                >
                  <Shield className="h-5 w-5" />
                  <span>Admin Dashboard</span>
                </Button>
              </Link>
            </>
          )}
        </nav>
      </ScrollArea>
      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={getAvatarUrl(user?.avatar || '')} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">
            <p className="font-semibold">{user?.name}</p>
            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} className="shrink-0">
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Log out</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
