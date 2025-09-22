import { StatCard } from "./dashboard/stat-card";
import { OverviewChart } from "./dashboard/overview-chart";
import { RecentActivities } from "./dashboard/recent-activities";
import { RecentRegistrations } from "./dashboard/recent-registrations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { MessageCircle, Server, Users, UserPlus } from "lucide-react";

export function AdminDashboard() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value="1,254" icon={Users} description="+20.1% from last month" />
        <StatCard title="Active Users" value="892" icon={UserPlus} description="+15.2% from last month" />
        <StatCard title="Messages Today" value="23,481" icon={MessageCircle} description="+180.1% from last month" />
        <StatCard title="Server Status" value="Online" icon={Server} description="Last check: 2 mins ago" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <OverviewChart />
        <RecentActivities />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <RecentRegistrations />
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>A log of recent system events.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">User 'Alice' logged in.</p>
            <p className="text-sm text-muted-foreground">User 'Bob' sent a message.</p>
            <p className="text-sm text_muted-foreground">New user 'Diana' registered.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Message Volume</CardTitle>
            <CardDescription>Total messages on platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1,234,567</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Footprint</CardTitle>
            <CardDescription>Current resource usage.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">CPU: 45%</p>
            <p className="text-sm">Memory: 60%</p>
            <p className="text-sm">Disk: 75%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
