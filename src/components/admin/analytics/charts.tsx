

"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Pie, PieChart, Cell, Area, AreaChart } from "recharts"
import { ChartConfig } from "@/components/ui/chart"
import { useMemo } from "react"
import { users, User } from "@/lib/data"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data generation
const generateUserGrowthData = () => {
    const data = [];
    let users = 800;
    for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        users += Math.floor(Math.random() * 20) - 5;
        data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            users: users,
        });
    }
    return data;
};

const generateMessageVolumeData = () => {
    const data = [];
    for (let i = 12; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        data.push({
            month: date.toLocaleString('default', { month: 'short' }),
            messages: Math.floor(Math.random() * 5000) + 2000,
        });
    }
    return data;
};

const generateHourlyMessageData = () => {
  const data = [];
  for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0') + ':00';
      data.push({
          hour,
          messages: Math.floor(Math.random() * 1000) + (i > 8 && i < 22 ? 200 : 0),
      });
  }
  return data;
};

const generateEngagementRateData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const mau = 1000 + i * 50 + Math.floor(Math.random() * 100);
        const dau = Math.floor(mau * (Math.random() * 0.2 + 0.35)); // 35-55% of MAU
        data.push({
            month: date.toLocaleString('default', { month: 'short' }),
            engagement: Math.round((dau / mau) * 100),
        });
    }
    return data;
};

const topUsersData = users.slice(0,5).map(u => ({...u, messages: Math.floor(Math.random() * 500) + 100})).sort((a,b) => b.messages - a.messages);

const activityBreakdownData = [
    { name: 'User', value: 400, fill: "hsl(var(--primary))" },
    { name: 'System', value: 300, fill: "hsl(var(--accent))" },
    { name: 'Admin', value: 150, fill: "hsl(var(--secondary))" },
    { name: 'Messaging', value: 200, fill: "hsl(var(--muted-foreground))" },
];

const userGrowthChartConfig = {
  users: {
    label: "Users",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

const messageVolumeChartConfig = {
    messages: {
      label: "Messages",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig

const activityBreakdownChartConfig = {
    User: { label: "User", color: "hsl(var(--primary))" },
    System: { label: "System", color: "hsl(var(--accent))" },
    Admin: { label: "Admin", color: "hsl(var(--secondary))" },
    Messaging: { label: "Messaging", color: "hsl(var(--muted-foreground))" },
  } satisfies ChartConfig;

const engagementRateChartConfig = {
    engagement: {
        label: "Engagement Rate",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig

const hourlyMessageVolumeConfig = {
    messages: {
        label: "Messages",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig


export function UserGrowthChart() {
    const data = useMemo(() => generateUserGrowthData(), []);
    return (
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New user registrations over the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={userGrowthChartConfig} className="h-[300px] w-full">
              <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 12 }} />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                />
                <Line
                  dataKey="users"
                  type="monotone"
                  stroke="var(--color-users)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
    );
}

export function MessageVolumeChart() {
    const data = useMemo(() => generateMessageVolumeData(), []);
    return (
        <Card>
            <CardHeader>
                <CardTitle>Message Volume</CardTitle>
                <CardDescription>Total messages sent per month for the last year.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={messageVolumeChartConfig} className="h-[300px] w-full">
                    <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="messages" fill="var(--color-messages)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export function ActivityBreakdownChart() {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Activity Breakdown</CardTitle>
                <CardDescription>Distribution of different activity types.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={activityBreakdownChartConfig} className="h-[250px] w-full">
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                        <Pie data={activityBreakdownData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} labelLine={false}>
                            {activityBreakdownData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <ChartLegend
                            content={<ChartLegendContent nameKey="name" />}
                            verticalAlign="bottom"
                            align="center"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export function EngagementRateChart() {
    const data = useMemo(() => generateEngagementRateData(), []);
    const yAxisTickFormatter = (value: number) => `${value}%`;
    const tooltipFormatter = (value: number) => `${value}%`;

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Engagement Rate (DAU/MAU)</CardTitle>
                <CardDescription>User stickiness over the last 6 months.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={engagementRateChartConfig} className="h-[250px] w-full">
                    <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                        <YAxis tickFormatter={yAxisTickFormatter} tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                        <ChartTooltip content={<ChartTooltipContent indicator="dot" formatter={tooltipFormatter} />} />
                        <Area
                            dataKey="engagement"
                            type="monotone"
                            fill="var(--color-engagement)"
                            stroke="var(--color-engagement)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export function TopUsersList() {
    const getAvatarUrl = (user: User) => {
        if (user.avatarType === 'custom') {
          return user.avatar;
        }
        return PlaceHolderImages.find(img => img.id === user.avatar)?.imageUrl;
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Top Active Users</CardTitle>
                <CardDescription>Users with the highest message count.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                {topUsersData.map((user) => (
                    <div key={user.id} className="flex items-center gap-4">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={getAvatarUrl(user)} alt="Avatar" />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="ml-auto font-medium">{user.messages} msgs</div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export function HourlyMessageVolumeChart() {
    const data = useMemo(() => generateHourlyMessageData(), []);
    return (
        <Card>
            <CardHeader>
                <CardTitle>Hourly Message Volume</CardTitle>
                <CardDescription>Message activity by hour of the day (UTC).</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={hourlyMessageVolumeConfig} className="h-[300px] w-full">
                    <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis 
                            dataKey="hour" 
                            tickLine={false} 
                            axisLine={false} 
                            tickMargin={8} 
                            fontSize={12}
                            interval={2} 
                        />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="messages" fill="var(--color-messages)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
