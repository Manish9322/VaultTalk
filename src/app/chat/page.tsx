import { MessageSquare } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <MessageSquare className="h-20 w-20 text-muted-foreground" />
      <h2 className="mt-6 text-2xl font-semibold">Welcome to VaultTalk</h2>
      <p className="mt-2 text-muted-foreground">Select a user from the sidebar to start a conversation.</p>
    </div>
  );
}
