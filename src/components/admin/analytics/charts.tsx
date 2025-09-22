"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Pie, PieChart, Cell } from "recharts"
import { ChartConfig } from "@/components/ui/chart"
import { useMemo } from "react"

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
        <Card>
            <CardHeader>
                <CardTitle>Activity Breakdown</CardTitle>
                <CardDescription>Distribution of different activity types.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={activityBreakdownChartConfig} className="h-[350px] w-full">
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                        <Pie data={activityBreakdownData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} labelLine={false}>
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
