"use client";

import { summarizeAdminActivity } from "@/ai/flows/summarize-admin-activity";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { activityLog } from "@/lib/data";
import { Loader2, Wand2 } from "lucide-react";
import { useState } from "react";

export function AdminDashboard() {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setSummary('');
    try {
      const result = await summarizeAdminActivity({ activityLog });
      setSummary(result.summary);
    } catch (error) {
      console.error("Failed to generate summary:", error);
      setSummary("Error: Could not generate activity summary.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 h-full">
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Raw Activity Log</CardTitle>
          <CardDescription>User activity from the last 24 hours.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 min-h-0">
          <ScrollArea className="h-full border rounded-md">
            <pre className="p-4 text-xs whitespace-pre-wrap font-mono">{activityLog.trim()}</pre>
          </ScrollArea>
        </CardContent>
        <CardFooter>
            <Button onClick={handleGenerateSummary} disabled={isLoading} className="w-full lg:w-auto">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Generate AI Summary
            </Button>
        </CardFooter>
      </Card>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>AI-Powered Summary</CardTitle>
          <CardDescription>An intelligent analysis of user activity.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                <p className="mt-2 text-muted-foreground">Analyzing activity...</p>
              </div>
            </div>
          )}
          {!isLoading && !summary && (
             <div className="flex items-center justify-center h-full text-center p-4">
                <div>
                    <Wand2 className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="mt-4 text-muted-foreground">Click "Generate AI Summary" to see an analysis of the activity log.</p>
                </div>
             </div>
          )}
          {summary && (
             <ScrollArea className="h-full">
                <p className="whitespace-pre-wrap">{summary}</p>
             </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
