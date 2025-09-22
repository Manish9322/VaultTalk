
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useConnections } from "@/hooks/use-connections";
import { User, ConnectionRequest } from "@/lib/data";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { UserPlus, UserCheck, Clock, Ban } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DiscoverPage() {
  const { user: currentUser, users } = useAuth();
  const { sendConnectionRequest, withdrawConnectionRequest } = useConnections();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const otherUsers = useMemo(() => {
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

  const getAvatarUrl = (avatarId: string) => {
    return PlaceHolderImages.find(img => img.id === avatarId)?.imageUrl;
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
         return <Button onClick={() => sendConnectionRequest(otherUser.id)}><UserPlus className="mr-2" /> Send Request</Button>;
      default:
        return <Button onClick={() => sendConnectionRequest(otherUser.id)}><UserPlus className="mr-2" /> Send Request</Button>;
    }
  };

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredUsers.map(user => (
          <Card key={user.id} className="flex flex-col">
            <CardHeader className="flex flex-col items-center text-center">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarImage src={getAvatarUrl(user.avatar)} alt={user.name} />
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
    </div>
  );
}
