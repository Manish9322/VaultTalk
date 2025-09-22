
"use client"

import { ParsedActivity } from "@/lib/activity-data"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export const columns: ColumnDef<ParsedActivity>[] = [
    {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
  {
    accessorKey: "timestamp",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Timestamp
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = row.getValue("timestamp") as Date;
        return <div className="font-medium">{date.toLocaleString()}</div>;
      }
  },
  {
    accessorKey: "level",
    header: "Level",
    cell: ({ row }) => {
        const level = row.getValue("level") as string;
        return <Badge 
            variant={level === 'ERROR' ? 'destructive' : level === 'WARN' ? 'secondary' : 'outline'}
            className={cn(
                level === 'WARN' && 'bg-yellow-200/80 text-yellow-900 border-yellow-300'
            )}
        >{level}</Badge>;
    },
    filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
  },
  {
    accessorKey: "category",
    header: "Category"
  },
  {
    accessorKey: "description",
    header: "Description",
  },
]
