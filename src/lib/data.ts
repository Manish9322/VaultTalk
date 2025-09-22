export type User = {
  id: string;
  name: string;
  avatar: string;
  email: string;
  online?: boolean;
};

export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
};

export const users: User[] = [
  { id: '1', name: 'Alice', avatar: '1', email: 'alice@whisper.com', online: true },
  { id: '2', name: 'Bob', avatar: '2', email: 'bob@whisper.com', online: false },
  { id: '3', name: 'Charlie', avatar: '3', email: 'charlie@whisper.com', online: true },
  { id: '4', name: 'Diana', avatar: '4', email: 'diana@whisper.com', online: false },
  { id: '5', name: 'Eve', avatar: '5', email: 'eve@whisper.com', online: true },
  { id: 'admin', name: 'Admin', avatar: '99', email: 'admin@whisper.com', online: true },
];

export const messages: Message[] = [
  { id: 'msg1', senderId: '1', receiverId: '2', text: 'Hey Bob, how are you?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: 'msg2', senderId: '2', receiverId: '1', text: 'Hey Alice! I am good, thanks. How about you?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5) },
  { id: 'msg3', senderId: '1', receiverId: '2', text: 'Doing great! Just working on the new project.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1) },
  { id: 'msg4', senderId: '2', receiverId: '1', text: 'Awesome! Let me know if you need any help.', timestamp: new Date(Date.now() - 1000 * 60 * 30) },
  { id: 'msg5', senderId: '1', receiverId: '3', text: 'Hi Charlie, are we still on for lunch tomorrow?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { id: 'msg6', senderId: '3', receiverId: '1', text: 'Yes, absolutely! See you at 1 PM.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23) },
];

export const activityLog = `
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
