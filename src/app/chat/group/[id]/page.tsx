
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Message, User, groups, users, messages as initialMessages, updateActivityLog } from "@/lib/data";
import { useAuth } from "@/hooks/use-auth";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState, FormEvent, useMemo } from "react";
import { SendHorizonal, Ban, Flag, ShieldAlert, MoreVertical, Users as UsersIcon, Loader2 } from "lucide-react";
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
import { moderateContent } from "@/ai/flows/moderate-content-flow";

export default function GroupChatConversationPage() {
  const { user: currentUser } = useAuth();
  const params = useParams();
  const groupId = params.id as string;
  const { toast } = useToast();
  
  const group = useMemo(() => groups.find(g => g.id === groupId), [groupId]);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
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
  
  const getAvatarUrl = (user: User) => {
    if (user.avatarType === 'custom') {
      return user.avatar;
    }
    return PlaceHolderImages.find(img => img.id === user.avatar)?.imageUrl;
  };

  const getGroupAvatarUrl = (avatarId: string) => {
    return PlaceHolderImages.find(img => img.id === avatarId)?.imageUrl;
  }
  
  const getSender = (senderId: string) => {
    return users.find(u => u.id === senderId);
  }

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !currentUser || !group) return;
    
    setIsSending(true);
    let messageText = newMessage;

    try {
      const moderationResult = await moderateContent({ text: newMessage });
      if (moderationResult.isSensitive) {
        messageText = moderationResult.redactedText;
        const now = new Date();
        const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        const logEntry = `[${timestamp}] [WARN] [Messaging] A message from User '${currentUser.name}' (ID: ${currentUser.id}) in Group '${group.name}' (ID: ${group.id}) was automatically redacted.`;
        updateActivityLog(logEntry);
        toast({
            title: "Content Redacted",
            description: "Your message was modified to remove sensitive information.",
            variant: "destructive"
        });
      }
    } catch (error) {
        console.error("Content moderation failed:", error);
    }

    const message: Message = {
      id: `msg${Date.now()}`,
      senderId: currentUser.id,
      receiverId: groupId,
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
    if(currentUser && flaggedMessage && group) {
        const sender = getSender(flaggedMessage.senderId);
        const now = new Date();
        const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        const logEntry = `[${timestamp}] [WARN] [Messaging] User '${currentUser.name}' (ID: ${currentUser.id}) flagged a message (ID: ${messageId}) from User '${sender?.name}' (ID: ${sender?.id}) in Group '${group.name}' (ID: ${group.id}).`;
        updateActivityLog(logEntry);
    }
    
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
          <AvatarImage src={getGroupAvatarUrl(group.avatar)} alt={group.name} />
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
                                    <AvatarImage src={getAvatarUrl(member)} />
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
                        <AvatarImage src={getAvatarUrl(sender)} alt={sender.name} />
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
    </div>
  );
}
