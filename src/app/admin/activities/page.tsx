
"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/admin/dashboard/stat-card";
import { List, AlertTriangle, ShieldAlert, Activity as ActivityIcon } from "lucide-react";
import { activityLog, ParsedActivity, parseActivityLog } from "@/lib/activity-data";
import { ActivityTable } from "@/components/admin/activities/activity-table";
import { columns } from "@/components/admin/activities/activity-columns";
import { summarizeAdminActivity } from "@/ai/flows/summarize-admin-activity";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export default function AdminActivitiesPage() {
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activities = useMemo(() => parseActivityLog(activityLog), []);

  const getFilteredActivities = (category: string | null) => {
    if (!category || category === "All") {
      return activities;
    }
    return activities.filter((a) => a.category === category);
  };

  const stats = useMemo(() => {
    return {
      total: activities.length,
      errors: activities.filter((a) => a.level === "ERROR").length,
      warnings: activities.filter((a) => a.level === "WARN").length,
      info: activities.filter((a) => a.level === "INFO").length,
    };
  }, [activities]);

  const handleGenerateSummary = async () => {
    setIsSummaryLoading(true);
    try {
      const result = await summarizeAdminActivity({ activityLog });
      setSummary(result.summary);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to generate summary:", error);
      setSummary("Sorry, I was unable to generate the summary at this time.");
      setIsModalOpen(true);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Activities</h1>
          <p className="text-muted-foreground">
            Track user and system activities.
          </p>
        </div>
        <Button onClick={handleGenerateSummary} disabled={isSummaryLoading}>
          {isSummaryLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ActivityIcon className="mr-2 h-4 w-4" />
          )}
          AI Summary
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Events"
          value={stats.total.toString()}
          icon={List}
          description="Total events recorded"
        />
        <StatCard
          title="Errors"
          value={stats.errors.toString()}
          icon={ShieldAlert}
          description="Critical errors"
        />
        <StatCard
          title="Warnings"
          value={stats.warnings.toString()}
          icon={AlertTriangle}
          description="Potential issues"
        />
        <StatCard
          title="Info"
          value={stats.info.toString()}
          icon={ActivityIcon}
          description="Informational events"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>
            A log of recent system and user events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="User">User</TabsTrigger>
              <TabsTrigger value="Admin">Admin</TabsTrigger>
              <TabsTrigger value="Messaging">Messaging</TabsTrigger>
              <TabsTrigger value="System">System</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <ActivityTable columns={columns} data={getFilteredActivities(null)} />
            </TabsContent>
            <TabsContent value="User">
              <ActivityTable columns={columns} data={getFilteredActivities("User")} />
            </TabsContent>
            <TabsContent value="Admin">
              <ActivityTable columns={columns} data={getFilteredActivities("Admin")} />
            </TabsContent>
            <TabsContent value="Messaging">
              <ActivityTable columns={columns} data={getFilteredActivities("Messaging")} />
            </TabsContent>
            <TabsContent value="System">
              <ActivityTable columns={columns} data={getFilteredActivities("System")} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>AI Activity Summary</AlertDialogTitle>
            <AlertDialogDescription>
              {summary}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
