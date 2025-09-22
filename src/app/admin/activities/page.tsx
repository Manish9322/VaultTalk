import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";

export default function AdminActivitiesPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-muted rounded-full p-3 w-fit">
            <Activity className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="mt-4">Activity Log</CardTitle>
          <CardDescription>This page is under construction.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Soon you'll be able to view detailed user activities and system events.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
