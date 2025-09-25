
"use client";

import { useAuth } from "./use-auth";
import { useToast } from "./use-toast";
import { 
    useSendConnectionRequestMutation,
    useAcceptConnectionRequestMutation,
    useDeclineOrWithdrawConnectionRequestMutation,
    useRemoveConnectionMutation,
    useBlockUserMutation,
    useUnblockUserMutation
} from "@/services/api";

export function useConnections() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  const [sendRequest] = useSendConnectionRequestMutation();
  const [acceptRequest] = useAcceptConnectionRequestMutation();
  const [declineOrWithdrawRequest] = useDeclineOrWithdrawConnectionRequestMutation();
  const [remove] = useRemoveConnectionMutation();
  const [block] = useBlockUserMutation();
  const [unblock] = useUnblockUserMutation();
  
  const handleApiCall = async (mutation: Function, { successMessage, errorMessage }: { successMessage: string, errorMessage: string }) => {
    if (!currentUser) {
        toast({ title: "Error", description: "You must be logged in to perform this action.", variant: "destructive" });
        return;
    }
    try {
      await mutation().unwrap();
      toast({ title: "Success", description: successMessage });
    } catch (error) {
      console.error(errorMessage, error);
      const apiError = error as any;
      const message = apiError?.data?.message || "Could not complete the action. Please try again.";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  const sendConnectionRequest = (targetUserId: string) => {
    handleApiCall(
        () => sendRequest({ currentUserId: currentUser!.id, targetUserId }),
        { successMessage: "Connection request sent.", errorMessage: "Failed to send connection request" }
    );
  };

  const withdrawConnectionRequest = (targetUserId: string) => {
    handleApiCall(
        () => declineOrWithdrawRequest({ currentUserId: currentUser!.id, targetUserId, action: 'withdraw' }),
        { successMessage: "Connection request withdrawn.", errorMessage: "Failed to withdraw connection request" }
    );
  };

  const acceptConnectionRequest = (requesterId: string) => {
    handleApiCall(
        () => acceptRequest({ currentUserId: currentUser!.id, targetUserId: requesterId }),
        { successMessage: "Connection accepted.", errorMessage: "Failed to accept connection request" }
    );
  };

  const declineConnectionRequest = (requesterId: string) => {
     handleApiCall(
        () => declineOrWithdrawRequest({ currentUserId: currentUser!.id, targetUserId: requesterId, action: 'decline' }),
        { successMessage: "Connection request declined.", errorMessage: "Failed to decline connection request" }
    );
  };

  const removeConnection = (targetUserId: string) => {
    handleApiCall(
        () => remove({ currentUserId: currentUser!.id, targetUserId }),
        { successMessage: "Connection removed.", errorMessage: "Failed to remove connection" }
    );
  };

  const blockUser = (targetUserId: string) => {
    handleApiCall(
        () => block({ currentUserId: currentUser!.id, targetUserId }),
        { successMessage: "User has been blocked.", errorMessage: "Failed to block user" }
    );
  };

  const unblockUser = (targetUserId: string) => {
    handleApiCall(
        () => unblock({ currentUserId: currentUser!.id, targetUserId }),
        { successMessage: "User has been unblocked.", errorMessage: "Failed to unblock user" }
    );
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
