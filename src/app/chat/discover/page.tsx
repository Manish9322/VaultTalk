
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useConnections } from "@/hooks/use-connections";
import { User } from "@/lib/data";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { UserPlus, UserCheck, Ban, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetAllUsersQuery } from "@/services/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DiscoverPage() {
  const { user: currentUser } = useAuth();
  const { sendConnectionRequest, withdrawConnectionRequest } = useConnections();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const { data: users = [], isLoading, isError, error } = useGetAllUsersQuery();

  const otherUsers = useMemo(() => {
    if (!users) return [];
    return users.filter(u => u.id !== currentUser?.id && u.email !== 'admin@vaulttalk.com');
  }, [users, currentUser]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery) {
      return otherUsers;
    }
    return otherUsers.filter(u =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [otherUsers, searchQuery]);

  const getAvatarUrl = (user: User) => {
    if (user.avatarType === 'custom' && user.avatar) {
      return user.avatar;
    }
    return PlaceHolderImages.find(img => img.id === user.avatar)?.imageUrl;
  };

  const getConnectionStatus = (otherUser: User): 'connected' | 'pending-outgoing' | 'pending-incoming' | 'blocked' | 'declined' | null => {
    if (!currentUser) return null;
    if (currentUser.connections?.includes(otherUser.id)) return 'connected';
    if (currentUser.blocked?.includes(otherUser.id)) return 'blocked';
    
    const request = currentUser.connectionRequests?.find(r => r.userId === otherUser.id);
    if (request) return request.status;

    return null;
  };

  const ActionButton = ({ otherUser }: { otherUser: User }) => {
    const status = getConnectionStatus(otherUser);

    switch (status) {
      case 'connected':
        return <Button variant="outline" disabled><UserCheck className="mr-2" /> Connected</Button>;
      case 'pending-outgoing':
        return <Button variant="secondary" onClick={() => withdrawConnectionRequest(otherUser.id)}>Withdraw Request</Button>;
      case 'pending-incoming':
        return <Button onClick={() => router.push(`/chat/${otherUser.id}`)}>Respond to Request</Button>;
      case 'blocked':
        return <Button variant="destructive" disabled><Ban className="mr-2" /> Blocked</Button>;
      case 'declined':
         return <Button variant="secondary" disabled>Request Declined</Button>;
      default:
        return <Button onClick={() => sendConnectionRequest(otherUser.id)}><UserPlus className="mr-2" /> Send Request</Button>;
    }
  };

  if (isError) {
    return (
        <div className="p-6">
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Failed to load users. Please try again later.
                </AlertDescription>
            </Alert>
        </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Discover Users</CardTitle>
          <CardDescription>Find and connect with other users on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </CardContent>
      </Card>
      
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="flex flex-col">
                    <CardHeader className="flex flex-col items-center text-center">
                        <Skeleton className="h-20 w-20 rounded-full mb-4" />
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-4 w-40" />
                    </CardHeader>
                    <CardContent className="flex-grow flex items-end justify-center">
                        <Skeleton className="h-10 w-36" />
                    </CardContent>
                </Card>
            ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredUsers.map(user => (
            <Card key={user.id} className="flex flex-col">
              <CardHeader className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src={getAvatarUrl(user)} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end justify-center">
                <ActionButton otherUser={user} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
