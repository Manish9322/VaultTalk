export type ConnectionRequest = {
  userId: string;
  status: 'pending-incoming' | 'pending-outgoing' | 'accepted' | 'declined';
};

export type User = {
  id: string;
  name: string;
  avatar: string;
  email: string;
  online?: boolean;
  connections?: string[]; // Array of user IDs
  blocked?: string[]; // Array of user IDs
  connectionRequests?: ConnectionRequest[];
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

export const users: User[] = [
  { 
    id: '1', 
    name: 'Alice', 
    avatar: '1', 
    email: 'alice@vaulttalk.com', 
    online: true, 
    connections: ['2'], 
    blocked: [],
    connectionRequests: [
      { userId: '2', status: 'accepted' },
      { userId: '4', status: 'pending-outgoing' }
    ]
  },
  { 
    id: '2', 
    name: 'Bob', 
    avatar: '2', 
    email: 'bob@vaulttalk.com', 
    online: false, 
    connections: ['1'], 
    blocked: [],
    connectionRequests: [
      { userId: '1', status: 'accepted' }
    ]
  },
  { 
    id: '3', 
    name: 'Charlie', 
    avatar: '3', 
    email: 'charlie@vaulttalk.com', 
    online: true, 
    connections: [], 
    blocked: [],
    connectionRequests: [
      { userId: '1', status: 'pending-incoming' }
    ]
  },
  { 
    id: '4', 
    name: 'Diana', 
    avatar: '4', 
    email: 'diana@vaulttalk.com', 
    online: false, 
    connections: [], 
    blocked: [],
    connectionRequests: []
  },
  { 
    id: '5', 
    name: 'Eve', 
    avatar: '5', 
    email: 'eve@vaulttalk.com', 
    online: true, 
    connections: [], 
    blocked: [],
    connectionRequests: []
  },
  { 
    id: 'admin', 
    name: 'Admin', 
    avatar: '99', 
    email: 'admin@vaulttalk.com', 
    online: true, 
    connections: [], 
    blocked: [],
    connectionRequests: []
  },
];

export const groups: Group[] = [
  { id: 'group1', name: 'Project Phoenix', avatar: '101', members: ['1', '2', '3'] },
  { id: 'group2', name: 'Marketing Team', avatar: '102', members: ['1', '4', '5'] },
  { id: 'group3', name: 'General', avatar: '103', members: ['1', '2', '3', '4', '5'] },
];

export let messages: Message[] = [
  // Direct Messages
  { id: 'msg1', senderId: '1', receiverId: '2', text: 'Hey Bob, how are you?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: 'msg2', senderId: '2', receiverId: '1', text: 'Hey Alice! I am good, thanks. How about you?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5) },
  { id: 'msg3', senderId: '1', receiverId: '2', text: 'Doing great! Just working on the new project.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1) },
  { id: 'msg4', senderId: '2', receiverId: '1', text: 'Awesome! Let me know if you need any help.', timestamp: new Date(Date.now() - 1000 * 60 * 30) },
  // Group Messages
  { id: 'g_msg1', senderId: '1', receiverId: 'group1', text: 'Hey team, Project Phoenix meeting at 3 PM today.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4) },
  { id: 'g_msg2', senderId: '2', receiverId: 'group1', text: 'Got it, thanks for the reminder!', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.5) },
  { id: 'g_msg3', senderId: '3', receiverId: 'group1', text: 'Will be there.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3) },
  { id: 'g_msg4', senderId: '4', receiverId: 'group2', text: 'New campaign launch next week, let\'s sync up.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { id: 'g_msg5', senderId: '1', receiverId: 'group2', text: 'Sure, I will set up a call.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23) },
];


export let activityLog = `
[2024-08-01 10:00:00] User 'Alice' (ID: 1) logged in.
[2024-08-01 10:05:12] User 'Alice' (ID: 1) sent a message to User 'Bob' (ID: 2).
[2024-08-01 10:05:45] User 'Bob' (ID: 2) logged in.
[2024-08-01 10:06:20] User 'Bob' (ID: 2) sent a message to User 'Alice' (ID: 1).
[2024-08-01 11:30:00] User 'Charlie' (ID: 3) logged in.
[2024-08-01 12:00:00] User 'Alice' (ID: 1) sent a message to User 'Charlie' (ID: 3).
[2024-08-01 14:15:30] User 'Diana' (ID: 4) created an account.
[2024-08-01 14:16:00] User 'Diana' (ID: 4) logged in.
[2024-08-01 15:00:00] User 'Eve' (ID: 5) logged in.
[2024-08-01 18:20:10] User 'Alice' (ID: 1) updated her profile.
[2024-08-01 22:45:00] User 'Admin' (ID: admin) logged in.
[2024-08-01 22:50:00] User 'Admin' (ID: admin) viewed the activity log.
[2024-08-01 23:30:00] User 'Bob' (ID: 2) logged out.
[2024-08-02 02:10:00] User 'Charlie' (ID: 3) failed login attempt.
[2024-08-02 02:10:05] User 'Charlie' (ID: 3) failed login attempt.
[2024-08-02 02:10:15] User 'Charlie' (ID: 3) failed login attempt. Account locked.
[2024-08-02 04:00:00] System maintenance started.
[2024-08-02 04:30:00] System maintenance finished.
`;

export function updateActivityLog(newEntry: string) {
  activityLog = `${activityLog.trim()}\n${newEntry}`;
}
