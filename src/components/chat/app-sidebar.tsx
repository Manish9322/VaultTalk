
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { LogOut, Shield, Search, UserCheck, UserPlus, Clock, Users as GroupIcon } from "lucide-react";
import { Logo } from "../logo";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { useState, useMemo } from "react";
import { User, ConnectionRequest, groups as allGroups, Group } from "@/lib/data";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "../ui/dropdown-menu";
import { ThemeToggle } from "../theme-toggle";

export function AppSidebar() {
  const { user: currentUser, users, logout } = useAuth();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const getAvatarUrl = (avatarId: string) => {
    return PlaceHolderImages.find(img => img.id === avatarId)?.imageUrl;
  };

  const getRequestStatus = (otherUser: User): ConnectionRequest['status'] | undefined => {
    return currentUser?.connectionRequests?.find(r => r.userId === otherUser.id)?.status;
  };

  const { connections, pendingRequests, otherUsers, groups } = useMemo(() => {
    const allOtherUsers = users.filter(u => u.id !== currentUser?.id && u.id !== 'admin' && !currentUser?.blocked?.includes(u.id));

    const connections = allOtherUsers.filter(u => currentUser?.connections?.includes(u.id));
    const pendingRequests = allOtherUsers.filter(u => getRequestStatus(u)?.startsWith('pending'));
    const otherUsers = allOtherUsers.filter(u => !currentUser?.connections?.includes(u.id) && !getRequestStatus(u)?.startsWith('pending'));
    
    const userGroups = allGroups.filter(g => g.members.includes(currentUser?.id || ''));

    if (!searchQuery) {
      return { connections, pendingRequests, otherUsers, groups: userGroups };
    }

    const lowercasedQuery = searchQuery.toLowerCase();
    return {
      connections: connections.filter(u => u.name.toLowerCase().includes(lowercasedQuery)),
      pendingRequests: pendingRequests.filter(u => u.name.toLowerCase().includes(lowercasedQuery)),
      otherUsers: otherUsers.filter(u => u.name.toLowerCase().includes(lowercasedQuery)),
      groups: userGroups.filter(g => g.name.toLowerCase().includes(lowercasedQuery)),
    };

  }, [currentUser, users, searchQuery]);


  const UserLink = ({ user }: { user: User }) => {
    const requestStatus = getRequestStatus(user);
    return (
      <Link href={`/chat/${user.id}`} passHref>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 h-12",
            pathname === `/chat/${user.id}` && "bg-accent text-accent-foreground"
          )}
        >
          <Avatar className="h-8 w-8 relative">
            <AvatarImage src={getAvatarUrl(user.avatar)} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            {user.online && <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background"></span>}
          </Avatar>
          <div className="flex-1 text-left truncate">
            <span className="truncate">{user.name}</span>
            {requestStatus === 'pending-incoming' && <p className="text-xs text-primary">Incoming request</p>}
            {requestStatus === 'pending-outgoing' && <p className="text-xs text-muted-foreground">Request sent</p>}
          </div>
        </Button>
      </Link>
    );
  };
  
  const GroupLink = ({ group }: { group: Group }) => {
    return (
      <Link href={`/chat/group/${group.id}`} passHref>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 h-12",
            pathname === `/chat/group/${group.id}` && "bg-accent text-accent-foreground"
          )}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={getAvatarUrl(group.avatar)} alt={group.name} />
            <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left truncate">
            <span className="truncate">{group.name}</span>
          </div>
        </Button>
      </Link>
    );
  };

  return (
    <div className="flex h-full max-h-screen flex-col">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Logo />
      </div>
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          
          {groups.length > 0 && (
            <>
              <h3 className="flex items-center gap-2 px-2 py-2 text-xs font-semibold text-muted-foreground"><GroupIcon className="h-4 w-4" /> Groups</h3>
              {groups.map((g) => <GroupLink key={g.id} group={g} />)}
            </>
          )}

          {connections.length > 0 && (
            <>
              <h3 className="flex items-center gap-2 px-2 py-2 mt-4 text-xs font-semibold text-muted-foreground"><UserCheck className="h-4 w-4" /> Connections</h3>
              {connections.map((u) => <UserLink key={u.id} user={u} />)}
            </>
          )}

          {pendingRequests.length > 0 && (
            <>
              <h3 className="flex items-center gap-2 px-2 py-2 mt-4 text-xs font-semibold text-muted-foreground"><Clock className="h-4 w-4" /> Pending</h3>
              {pendingRequests.map((u) => <UserLink key={u.id} user={u} />)}
            </>
          )}

          {otherUsers.length > 0 && (
            <>
               <h3 className="flex items-center gap-2 px-2 py-2 mt-4 text-xs font-semibold text-muted-foreground"><UserPlus className="h-4 w-4" /> Other Users</h3>
               {otherUsers.map((u) => <UserLink key={u.id} user={u} />)}
            </>
          )}


          {currentUser?.email === 'admin@vaulttalk.com' && (
            <>
              <h3 className="px-2 py-2 text-xs font-semibold text-muted-foreground mt-4">Admin</h3>
              <Link href="/admin/dashboard" passHref>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3",
                    pathname.startsWith('/admin') && "bg-accent text-accent-foreground"
                  )}
                >
                  <Shield className="h-5 w-5" />
                  <span>Admin Panel</span>
                </Button>
              </Link>
            </>
          )}
        </nav>
      </ScrollArea>
      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-3">
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 w-full justify-start p-0 h-auto">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={getAvatarUrl(currentUser?.avatar || '')} alt={currentUser?.name} />
                    <AvatarFallback>{currentUser?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 truncate text-left">
                    <p className="font-semibold">{currentUser?.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{currentUser?.email}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mb-2 w-[250px]">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                          <ThemeToggle />
                      </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <AlertDialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
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
              </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
