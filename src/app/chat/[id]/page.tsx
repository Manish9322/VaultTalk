"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Message, User, messages as allMessages, users } from "@/lib/data";
import { useAuth } from "@/hooks/use-auth";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState, FormEvent } from "react";
import { SendHorizonal } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChatConversationPage() {
  const { user: currentUser } = useAuth();
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
      const filteredMessages = allMessages.filter(
        (m) =>
          (m.senderId === currentUser.id && m.receiverId === otherUserId) ||
          (m.senderId === otherUserId && m.receiverId === currentUser.id)
      ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      setMessages(filteredMessages);
    }
  }, [otherUserId, currentUser]);
  
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
        <div>
          <h2 className="text-lg font-semibold">{otherUser.name}</h2>
          <p className="text-sm text-muted-foreground">{otherUser.online ? "Online" : "Offline"}</p>
        </div>
      </header>
      
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
    </div>
  );
}
