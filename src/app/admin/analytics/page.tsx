import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart, Users, MessageCircle, Ratio, UserPlus, TrendingUp } from "lucide-react";
import { UserGrowthChart, MessageVolumeChart, ActivityBreakdownChart, EngagementRateChart, TopUsersList, HourlyMessageVolumeChart } from "@/components/admin/analytics/charts";
import { StatCard } from "@/components/admin/dashboard/stat-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { users } from "@/lib/data";

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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard 
            title="Daily Active Users"
            value="452"
            icon={Users}
            description="Users active in last 24h"
        />
        <StatCard 
            title="New Users Today"
            value="23"
            icon={UserPlus}
            description="+5% from yesterday"
        />
         <StatCard 
            title="Total Messages"
            value="1,254,832"
            icon={MessageCircle}
            description="All-time messages sent"
        />
         <StatCard 
            title="Messages Per User"
            value="99.2"
            icon={Ratio}
            description="Average messages per user"
        />
        <StatCard 
            title="Engagement Rate"
            value="41%"
            icon={TrendingUp}
            description="DAU/MAU ratio"
        />
        <StatCard 
            title="Monthly Active Users"
            value="1,102"
            icon={Users}
            description="+12% from last month"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <UserGrowthChart />
        <MessageVolumeChart />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ActivityBreakdownChart />
        <EngagementRateChart />
        <TopUsersList />
      </div>

       <div className="grid grid-cols-1 gap-6">
        <HourlyMessageVolumeChart />
      </div>
    </div>
  );
}
