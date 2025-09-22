
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, UserX, XCircle, UserCheck } from "lucide-react";
import { useConnections } from "@/hooks/use-connections";
import { User } from "@/lib/data";

interface ChatHeaderActionsProps {
  otherUser: User;
  isBlocked: boolean;
  isConnection: boolean;
}

export function ChatHeaderActions({ otherUser, isBlocked, isConnection }: ChatHeaderActionsProps) {
  const { removeConnection, blockUser, unblockUser } = useConnections();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
          <span className="sr-only">More options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isConnection && (
          <DropdownMenuItem onClick={() => removeConnection(otherUser.id)}>
            <XCircle className="mr-2 h-4 w-4" />
            Remove Connection
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        {isBlocked ? (
          <DropdownMenuItem onClick={() => unblockUser(otherUser.id)}>
            <UserCheck className="mr-2 h-4 w-4" />
            Unblock User
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => blockUser(otherUser.id)}
          >
            <UserX className="mr-2 h-4 w-4" />
            Block User
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
