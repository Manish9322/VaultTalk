"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Message, User, messages as initialMessages } from "@/lib/data";
import { useAuth } from "@/hooks/use-auth";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState, FormEvent, useMemo } from "react";
import { SendHorizonal, Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatHeaderActions } from "@/components/chat/chat-header-actions";
import { ConnectionRequestActions } from "@/components/chat/connection-request-actions";

export default function ChatConversationPage() {
  const { user: currentUser, users } = useAuth();
  const params = useParams();
  const otherUserId = params.id as string;
  
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
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

  const getAvatarUrl = (avatarId: string) => {
    return PlaceHolderImages.find(img => img.id === avatarId)?.imageUrl;
  }

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


  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !currentUser) return;

    const message: Message = {
      id: `msg${Date.now()}`,
      senderId: currentUser.id,
      receiverId: otherUserId,
      text: newMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  if (!otherUser) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center gap-4 p-4 border-b shrink-0">
        <Avatar className="h-10 w-10">
          <AvatarImage src={getAvatarUrl(otherUser.avatar)} alt={otherUser.name} />
          <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{otherUser.name}</h2>
          <p className="text-sm text-muted-foreground">{otherUser.online ? "Online" : "Offline"}</p>
        </div>
        <ChatHeaderActions otherUser={otherUser} isBlocked={isYouBlocking} isConnection={isConnection} />
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
                    "flex items-end gap-2",
                    message.senderId === currentUser?.id ? "justify-end" : "justify-start"
                )}
                >
                {message.senderId !== currentUser?.id && (
                    <Avatar className="h-8 w-8">
                    <AvatarImage src={getAvatarUrl(otherUser.avatar)} alt={otherUser.name} />
                    <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                )}
                <div
                    className={cn(
                    "max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 shadow-sm",
                    message.senderId === currentUser?.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border"
                    )}
                >
                    <p>{message.text}</p>
                </div>
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
            />
            <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                <SendHorizonal className="h-5 w-5" />
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
