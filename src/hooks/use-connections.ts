

"use client";

import { useAuth } from "./use-auth";
import { User } from "@/lib/data";
import { useToast } from "./use-toast";

export function useConnections() {
  const { user: currentUser, users, updateUsers } = useAuth();
  const { toast } = useToast();

  const updateUser = (userId: string, updates: Partial<User>) => {
    const newUsers = users.map(u => u.id === userId ? { ...u, ...updates } : u);
    updateUsers(newUsers);
  };

  const sendConnectionRequest = (targetUserId: string) => {
    if (!currentUser) return;

    // Update target user's requests
    const targetUser = users.find(u => u.id === targetUserId);
    if (targetUser) {
        const newRequests = [...(targetUser.connectionRequests?.filter(r => r.userId !== currentUser.id) || []), { userId: currentUser.id, status: 'pending-incoming' as const }];
        updateUser(targetUserId, { connectionRequests: newRequests });
    }

    // Update current user's requests
    const newRequests = [...(currentUser.connectionRequests?.filter(r => r.userId !== targetUserId) || []), { userId: targetUserId, status: 'pending-outgoing' as const }];
    updateUser(currentUser.id, { connectionRequests: newRequests });

    toast({ title: "Success", description: "Connection request sent." });
  };

  const withdrawConnectionRequest = (targetUserId: string) => {
    if (!currentUser) return;

    // Update current user: remove the outgoing request
    const newCurrentUserRequests = currentUser.connectionRequests?.filter(r => r.userId !== targetUserId) || [];
    updateUser(currentUser.id, { connectionRequests: newCurrentUserRequests });

    // Update target user: remove the incoming request
    const targetUser = users.find(u => u.id === targetUserId);
    if (targetUser) {
        const newTargetUserRequests = targetUser.connectionRequests?.filter(r => r.userId !== currentUser.id) || [];
        updateUser(targetUserId, { connectionRequests: newTargetUserRequests });
    }

    toast({ title: "Request Withdrawn", description: "Your connection request has been withdrawn." });
  };


  const acceptConnectionRequest = (targetUserId: string) => {
    if (!currentUser) return;
    
    // Update current user: move from requests to connections
    const newCurrentUserRequests = currentUser.connectionRequests?.map(r => r.userId === targetUserId ? { ...r, status: 'accepted' as const } : r) || [];
    const newCurrentUserConnections = [...(currentUser.connections || []), targetUserId];
    updateUser(currentUser.id, { connections: newCurrentUserConnections, connectionRequests: newCurrentUserRequests });

    // Update target user: move from requests to connections
    const targetUser = users.find(u => u.id === targetUserId);
    if (targetUser) {
        const newTargetUserRequests = targetUser.connectionRequests?.map(r => r.userId === currentUser.id ? { ...r, status: 'accepted' as const } : r) || [];
        const newTargetUserConnections = [...(targetUser.connections || []), currentUser.id];
        updateUser(targetUserId, { connections: newTargetUserConnections, connectionRequests: newTargetUserRequests });
    }

    toast({ title: "Success", description: "Connection accepted." });
  };

  const declineConnectionRequest = (targetUserId: string) => {
    if (!currentUser) return;

    // Update current user: change request status to 'declined'
    const newCurrentUserRequests = currentUser.connectionRequests?.map(r => r.userId === targetUserId ? { ...r, status: 'declined' as const } : r) || [];
    updateUser(currentUser.id, { connectionRequests: newCurrentUserRequests });

    // Update target user: change request status to 'declined'
     const targetUser = users.find(u => u.id === targetUserId);
     if (targetUser) {
        const newTargetUserRequests = targetUser.connectionRequests?.map(r => r.userId === currentUser.id ? { ...r, status: 'declined' as const } : r) || [];
        updateUser(targetUserId, { connectionRequests: newTargetUserRequests });
     }

    toast({ title: "Request Declined", description: "You have declined the connection request." });
  };

  const removeConnection = (targetUserId: string) => {
    if (!currentUser) return;

    // Update current user
    const newCurrentUserConnections = currentUser.connections?.filter(id => id !== targetUserId) || [];
    const newCurrentUserRequests = currentUser.connectionRequests?.filter(r => r.userId !== targetUserId) || [];
    updateUser(currentUser.id, { connections: newCurrentUserConnections, connectionRequests: newCurrentUserRequests });

    // Update target user
    const targetUser = users.find(u => u.id === targetUserId);
    if (targetUser) {
        const newTargetUserConnections = targetUser.connections?.filter(id => id !== currentUser.id) || [];
        const newTargetUserRequests = targetUser.connectionRequests?.filter(r => r.userId !== currentUser.id) || [];
        updateUser(targetUserId, { connections: newTargetUserConnections, connectionRequests: newTargetUserRequests });
    }
    toast({ title: "Connection Removed" });
  };

  const blockUser = (targetUserId: string) => {
    if (!currentUser) return;

    // Remove from connections if they are connected
    removeConnection(targetUserId);

    // Add to blocked list
    const newBlocked = [...(currentUser.blocked || []), targetUserId];
    updateUser(currentUser.id, { blocked: newBlocked });
    toast({ title: "User Blocked", variant: "destructive" });
  };

  const unblockUser = (targetUserId: string) => {
    if (!currentUser) return;

    const newBlocked = currentUser.blocked?.filter(id => id !== targetUserId) || [];
    updateUser(currentUser.id, { blocked: newBlocked });
    toast({ title: "User Unblocked" });
  };

  return {
    sendConnectionRequest,
    withdrawConnectionRequest,
    acceptConnectionRequest,
    declineConnectionRequest,
    removeConnection,
    blockUser,
    unblockUser,
  };
}
