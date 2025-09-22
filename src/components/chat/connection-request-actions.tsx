
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useConnections } from "@/hooks/use-connections";
import { UserPlus, UserCheck, XCircle } from "lucide-react";

interface ConnectionRequestActionsProps {
  otherUserId: string;
  status: "pending-incoming" | "pending-outgoing" | "declined" | null;
}

export function ConnectionRequestActions({ otherUserId, status }: ConnectionRequestActionsProps) {
  const { sendConnectionRequest, acceptConnectionRequest, declineConnectionRequest } = useConnections();

  if (status === "pending-incoming") {
    return (
      <Card className="m-4">
        <CardHeader className="text-center">
            <CardTitle>Connection Request</CardTitle>
            <CardDescription>This user wants to connect with you.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center gap-4">
            <Button onClick={() => acceptConnectionRequest(otherUserId)}>
                <UserCheck className="mr-2 h-4 w-4" />
                Accept
            </Button>
            <Button variant="destructive" onClick={() => declineConnectionRequest(otherUserId)}>
                <XCircle className="mr-2 h-4 w-4" />
                Decline
            </Button>
        </CardContent>
      </Card>
    );
  }

  if (status === "pending-outgoing") {
    return (
        <div className="p-4 text-center text-sm text-muted-foreground">
            Connection request sent. Waiting for a response.
        </div>
    );
  }
  
  if (status === "declined") {
    return (
        <div className="p-4 text-center text-sm text-muted-foreground">
            You have declined this connection request.
        </div>
    );
  }

  return (
    <div className="p-4">
      <Button className="w-full" onClick={() => sendConnectionRequest(otherUserId)}>
        <UserPlus className="mr-2 h-4 w-4" />
        Send Connection Request
      </Button>
    </div>
  );
}
