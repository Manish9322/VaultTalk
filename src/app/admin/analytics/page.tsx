import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart, Users, MessageCircle, Ratio } from "lucide-react";
import { UserGrowthChart, MessageVolumeChart, ActivityBreakdownChart } from "@/components/admin/analytics/charts";
import { StatCard } from "@/components/admin/dashboard/stat-card";

export default function AdminAnalyticsPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
       <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            In-depth metrics and visualizations.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
            title="Daily Active Users"
            value="452"
            icon={Users}
            description="Users active in last 24h"
        />
        <StatCard 
            title="Monthly Active Users"
            value="1,102"
            icon={Users}
            description="+12% from last month"
        />
         <StatCard 
            title="Total Messages"
            value="1,254,832"
            icon={MessageCircle}
            description="All-time messages sent"
        />
         <StatCard 
            title="Msg/User Ratio"
            value="99.2"
            icon={Ratio}
            description="Average messages per user"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <UserGrowthChart />
        <MessageVolumeChart />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ActivityBreakdownChart />
      </div>
    </div>
  );
}
