
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Message, User, messages as initialMessages, updateActivityLog } from "@/lib/data";
import { useAuth } from "@/hooks/use-auth";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState, FormEvent, useMemo } from "react";
import { SendHorizonal, Ban, Flag, ShieldAlert, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatHeaderActions } from "@/components/chat/chat-header-actions";
import { ConnectionRequestActions } from "@/components/chat/connection-request-actions";
import { useToast } from "@/hooks/use-toast";
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
import { moderateContent } from "@/ai/flows/moderate-content-flow";

export default function ChatConversationPage() {
  const { user: currentUser, users } = useAuth();
  const params = useParams();
  const otherUserId = params.id as string;
  const { toast } = useToast();
  
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = users.find(u => u.id === otherUserId);
    setOtherUser(user || null);

    if (currentUser && otherUserId) {
      const filteredMessages = initialMessages.filter(
        (m) =>
          (m.senderId === currentUser.id && m.receiverId === otherUserId) ||
          (m.senderId === otherUserId && m.receiverId === currentUser.id)
      ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      setMessages(filteredMessages);
    }
  }, [otherUserId, currentUser, users]);
  
  const scrollToBottom = () => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAvatarUrl = (user: User) => {
    if (user.avatarType === 'custom') {
      return user.avatar;
    }
    return PlaceHolderImages.find(img => img.id === user.avatar)?.imageUrl;
  };

  const { isConnection, connectionStatus, isBlocked, isYouBlocking } = useMemo(() => {
    if (!currentUser || !otherUser) {
      return { isConnection: false, connectionStatus: null, isBlocked: false, isYouBlocking: false };
    }
    const isConnection = currentUser.connections?.includes(otherUser.id);
    const connectionStatus = currentUser.connectionRequests?.find(r => r.userId === otherUser.id)?.status ?? null;
    const isYouBlocking = currentUser.blocked?.includes(otherUser.id);
    const isOtherUserBlocking = otherUser.blocked?.includes(currentUser.id);

    return { 
      isConnection, 
      connectionStatus, 
      isBlocked: isYouBlocking || isOtherUserBlocking, 
      isYouBlocking
    };
  }, [currentUser, otherUser]);


  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !currentUser || !otherUser) return;

    setIsSending(true);
    let messageText = newMessage;

    try {
      const moderationResult = await moderateContent({ text: newMessage });
      if (moderationResult.isSensitive) {
        messageText = moderationResult.redactedText;
        const now = new Date();
        const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        const logEntry = `[${timestamp}] [WARN] [Messaging] A message from User '${currentUser.name}' (ID: ${currentUser.id}) to User '${otherUser.name}' (ID: ${otherUser.id}) was automatically redacted.`;
        updateActivityLog(logEntry);
        toast({
            title: "Content Redacted",
            description: "Your message was modified to remove sensitive information.",
            variant: "destructive"
        });
      }
    } catch (error) {
        console.error("Content moderation failed:", error);
        // Optionally, handle moderation failure (e.g., prevent sending or send anyway)
    }


    const message: Message = {
      id: `msg${Date.now()}`,
      senderId: currentUser.id,
      receiverId: otherUserId,
      text: messageText,
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage("");
    setIsSending(false);
  };

  const handleFlagMessage = (messageId: string) => {
    setMessages(messages.map(m => m.id === messageId ? { ...m, isFlagged: true } : m));
    
    const flaggedMessage = messages.find(m => m.id === messageId);
    if(currentUser && flaggedMessage){
        const now = new Date();
        const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        const logEntry = `[${timestamp}] [WARN] [Messaging] User '${currentUser.name}' (ID: ${currentUser.id}) flagged a message (ID: ${messageId}) from User '${otherUser?.name}' (ID: ${otherUser?.id}).`;
        updateActivityLog(logEntry);
    }
    
    toast({
        title: "Message Flagged",
        description: "Thank you for your report. The content has been flagged for review.",
    });
  };

  if (!otherUser) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center gap-4 p-4 border-b shrink-0">
        <Avatar className="h-10 w-10">
          <AvatarImage src={getAvatarUrl(otherUser)} alt={otherUser.name} />
          <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{otherUser.name}</h2>
          <p className="text-sm text-muted-foreground">{otherUser.online ? "Online" : "Offline"}</p>
        </div>
        <ChatHeaderActions otherUser={otherUser} isBlocked={isYouBlocking} isConnection={!!isConnection} />
      </header>
      
      {isBlocked ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
            <Ban className="h-16 w-16 text-destructive" />
            <h2 className="mt-4 text-xl font-semibold">
              {isYouBlocking ? "You have blocked this user" : "You are blocked by this user"}
            </h2>
            <p className="text-muted-foreground">
                {isYouBlocking ? "You cannot send or receive messages." : "You cannot interact with this user."}
            </p>
        </div>
      ) : isConnection ? (
        <>
        <ScrollArea className="flex-1" viewportRef={scrollViewportRef}>
            <div className="p-6 space-y-6">
            {messages.map((message) => (
                <div
                key={message.id}
                className={cn(
                    "flex items-end gap-2 group",
                    message.senderId === currentUser?.id ? "justify-end" : "justify-start"
                )}
                >
                {message.senderId !== currentUser?.id && (
                    <Avatar className="h-8 w-8">
                    <AvatarImage src={getAvatarUrl(otherUser)} alt={otherUser.name} />
                    <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                )}
                <div
                    className={cn(
                    "max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-3 shadow-sm relative",
                    message.senderId === currentUser?.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border",
                     message.isFlagged && "bg-destructive/20 border-destructive"
                    )}
                >
                    <p>{message.text}</p>
                    {message.isFlagged && <ShieldAlert className="absolute top-1 right-1 h-4 w-4 text-destructive" />}
                </div>

                {!message.isFlagged && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Flag className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Flag Message for Review?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will mark the message as inappropriate and submit it for review. Are you sure you want to proceed?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleFlagMessage(message.id)}>
                          Flag Message
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                </div>
            ))}
            </div>
        </ScrollArea>

        <footer className="p-4 border-t shrink-0">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                autoComplete="off"
                disabled={isSending}
            />
            <Button type="submit" size="icon" disabled={!newMessage.trim() || isSending}>
                {isSending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <SendHorizonal className="h-5 w-5" />
                )}
                <span className="sr-only">Send</span>
            </Button>
            </form>
        </footer>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
            <ConnectionRequestActions otherUserId={otherUser.id} status={connectionStatus} />
        </div>
      )}
    </div>
  );
}
