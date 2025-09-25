
export type ConnectionRequest = {
  userId: string;
  status: 'pending-incoming' | 'pending-outgoing' | 'accepted' | 'declined';
};

export type User = {
  id: string;
  _id?: string; // from mongodb
  name: string;
  avatar: string;
  avatarType?: 'custom' | 'placeholder';
  email: string;
  online?: boolean;
  connections?: string[]; // Array of user IDs
  blocked?: string[]; // Array of user IDs
  connectionRequests?: ConnectionRequest[];
  createdAt?: string | Date;
  lastLogin?: string | Date;
};

export type Group = {
  id: string;
  name: string;
  avatar: string;
  members: string[]; // Array of user IDs
}

export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
  isFlagged?: boolean;
};

// Mock data has been removed. All data should be fetched from the API.

export const users: User[] = [];
export const groups: Group[] = [];
export let messages: Message[] = [];

// Activity log is now managed in its own file and should be fetched from a persistent source in a real app.
export let activityLog = ``;

export function updateActivityLog(newEntry: string) {
  // In a real app, this would write to a database or logging service.
  // For now, this function is a placeholder.
  activityLog = `${activityLog.trim()}\n${newEntry}`;
}
