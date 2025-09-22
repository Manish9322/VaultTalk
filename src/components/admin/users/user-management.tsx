import { users } from "@/lib/data";
import { columns } from "./user-columns";
import { DataTable } from "./data-table";
import { StatCard } from "../dashboard/stat-card";
import { Users, UserPlus, LogIn, UserCheck } from "lucide-react";

export function UserManagement() {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Users" value="1,254" icon={Users} description="All registered users" />
                <StatCard title="New Users (Month)" value="123" icon={UserPlus} description="Joined this month" />
                <StatCard title="Active Today" value="452" icon={UserCheck} description="Users active in last 24h" />
                <StatCard title="Users Logged In" value="892" icon={LogIn} description="Currently logged in" />
            </div>
            <DataTable columns={columns} data={users} />
        </div>
    );
}
