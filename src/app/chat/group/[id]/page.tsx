
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Message, User, groups, users, messages as initialMessages } from "@/lib/data";
import { useAuth } from "@/hooks/use-auth";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState, FormEvent, useMemo } from "react";
import { SendHorizonal, Ban, Flag, ShieldAlert, MoreVertical, Users as UsersIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function GroupChatConversationPage() {
  const { user: currentUser } = useAuth();
  const params = useParams();
  const groupId = params.id as string;
  const { toast } = useToast();
  
  const group = useMemo(() => groups.find(g => g.id === groupId), [groupId]);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);

  useEffect(() => {
    if (groupId) {
      const filteredMessages = initialMessages.filter(
        (m) => m.receiverId === groupId
      ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      setMessages(filteredMessages);
    }
  }, [groupId]);
  
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
  
  const getSender = (senderId: string) => {
    return users.find(u => u.id === senderId);
  }

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !currentUser) return;

    const message: Message = {
      id: `msg${Date.now()}`,
      senderId: currentUser.id,
      receiverId: groupId,
      text: newMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleFlagMessage = (messageId: string) => {
    setMessages(messages.map(m => m.id === messageId ? { ...m, isFlagged: true } : m));
    toast({
        title: "Message Flagged",
        description: "Thank you for your report. The content has been flagged for review.",
    });
  };

  if (!group) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center gap-4 p-4 border-b shrink-0">
        <Avatar className="h-10 w-10">
          <AvatarImage src={getAvatarUrl(group.avatar)} alt={group.name} />
          <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{group.name}</h2>
          <p className="text-sm text-muted-foreground">{group.members.length} members</p>
        </div>
        <Dialog open={isMembersModalOpen} onOpenChange={setIsMembersModalOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                        <span className="sr-only">More options</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>View members</DropdownMenuItem>
                    </DialogTrigger>
                    <DropdownMenuItem className="text-destructive">Leave group</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <UsersIcon className="h-6 w-6" />
                    <span>Group Members</span>
                </DialogTitle>
                <DialogDescription>
                    People in the &quot;{group.name}&quot; group.
                </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[50vh]">
                    <div className="space-y-4 pr-6">
                    {group.members.map(memberId => {
                        const member = getSender(memberId);
                        if (!member) return null;
                        return (
                            <div key={memberId} className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={getAvatarUrl(member.avatar)} />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-semibold">{member.name}</p>
                                    <p className="text-sm text-muted-foreground">{member.email}</p>
                                </div>
                                {member.id === currentUser?.id && (
                                    <span className="text-xs text-muted-foreground">(You)</span>
                                )}
                            </div>
                        )
                    })}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
      </header>
      
        <>
        <ScrollArea className="flex-1" viewportRef={scrollViewportRef}>
            <div className="p-6 space-y-6">
            {messages.map((message) => {
                const sender = getSender(message.senderId);
                if (!sender) return null;

                return (
                <div
                    key={message.id}
                    className={cn(
                        "flex items-end gap-2 group",
                        message.senderId === currentUser?.id ? "justify-end" : "justify-start"
                    )}
                >
                    {message.senderId !== currentUser?.id && (
                        <Avatar className="h-8 w-8">
                        <AvatarImage src={getAvatarUrl(sender.avatar)} alt={sender.name} />
                        <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
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
                        {message.senderId !== currentUser?.id && (
                            <p className="text-xs font-semibold mb-1">{sender.name}</p>
                        )}
                        <p>{message.text}</p>
                        {message.isFlagged && <ShieldAlert className="absolute top-1 right-1 h-4 w-4 text-destructive" />}
                    </div>

                    {!message.isFlagged && message.senderId !== currentUser?.id && (
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
            )})}
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
    </div>
  );
}
