
export type ActivityLevel = "INFO" | "WARN" | "ERROR";
export type ActivityCategory = "User" | "Admin" | "Messaging" | "System";

export type ParsedActivity = {
  id: string;
  timestamp: Date;
  level: ActivityLevel;
  category: ActivityCategory;
  description: string;
};

export const activityLog = `
[2024-08-01 10:00:00] [INFO] [User] User 'Alice' (ID: 1) logged in.
[2024-08-01 10:05:12] [INFO] [Messaging] User 'Alice' (ID: 1) sent a message to User 'Bob' (ID: 2).
[2024-08-01 10:05:45] [INFO] [User] User 'Bob' (ID: 2) logged in.
[2024-08-01 10:06:20] [INFO] [Messaging] User 'Bob' (ID: 2) sent a message to User 'Alice' (ID: 1).
[2024-08-01 11:30:00] [INFO] [User] User 'Charlie' (ID: 3) logged in.
[2024-08-01 12:00:00] [INFO] [Messaging] User 'Alice' (ID: 1) sent a message to User 'Charlie' (ID: 3).
[2024-08-01 14:15:30] [INFO] [User] User 'Diana' (ID: 4) created an account.
[2024-08-01 14:16:00] [INFO] [User] User 'Diana' (ID: 4) logged in.
[2024-08-01 15:00:00] [INFO] [User] User 'Eve' (ID: 5) logged in.
[2024-08-01 18:20:10] [INFO] [User] User 'Alice' (ID: 1) updated her profile.
[2024-08-01 22:45:00] [INFO] [Admin] User 'Admin' (ID: admin) logged in.
[2024-08-01 22:50:00] [INFO] [Admin] User 'Admin' (ID: admin) viewed the activity log.
[2024-08-01 23:30:00] [INFO] [User] User 'Bob' (ID: 2) logged out.
[2024-08-02 02:10:00] [WARN] [User] User 'Charlie' (ID: 3) failed login attempt.
[2024-08-02 02:10:05] [WARN] [User] User 'Charlie' (ID: 3) failed login attempt.
[2024-08-02 02:10:15] [ERROR] [User] User 'Charlie' (ID: 3) failed login attempt. Account locked.
[2024-08-02 04:00:00] [INFO] [System] System maintenance started.
[2024-08-02 04:30:00] [INFO] [System] System maintenance finished.
`;

export function parseActivityLog(log: string): ParsedActivity[] {
    const lines = log.trim().split('\n');
    return lines.map((line, index) => {
        const match = line.match(/\[(.*?)\]\s\[(.*?)\]\s\[(.*?)\]\s(.*)/);
        if (match) {
            const [, timestamp, level, category, description] = match;
            return {
                id: `act_${index}`,
                timestamp: new Date(timestamp),
                level: level as ActivityLevel,
                category: category as ActivityCategory,
                description: description.trim(),
            };
        }
        // Fallback for lines that don't match the new format
        const oldMatch = line.match(/\[(.*?)\]\s(.*)/);
        if (oldMatch) {
            const [, timestamp, description] = oldMatch;
            return {
                id: `act_${index}`,
                timestamp: new Date(timestamp),
                level: 'INFO' as ActivityLevel,
                category: 'System' as ActivityCategory,
                description: description.trim(),
            }
        }
        return null;
    }).filter((item): item is ParsedActivity => item !== null);
}
