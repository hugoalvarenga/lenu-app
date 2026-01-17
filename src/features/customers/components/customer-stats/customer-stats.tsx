"use client";

import {
  BookOpen,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui";
import { cn } from "@/shared/lib/utils";
import type { CustomerStats as CustomerStatsType } from "../../services/customer-analytics.service";

interface CustomerStatsProps {
  stats: CustomerStatsType;
}

const statItems = [
  {
    key: "totalRentals" as const,
    label: "Total de Aluguéis",
    icon: BookOpen,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    key: "activeRentals" as const,
    label: "Ativos",
    icon: Clock,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    key: "completedRentals" as const,
    label: "Concluídos",
    icon: CheckCircle,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    key: "cancelledRentals" as const,
    label: "Cancelados",
    icon: XCircle,
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
  },
  {
    key: "overdueRentals" as const,
    label: "Em Atraso",
    icon: AlertTriangle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    key: "averageRentalDays" as const,
    label: "Média de Dias",
    icon: Calendar,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    suffix: " dias",
  },
];

export function CustomerStats({ stats }: CustomerStatsProps) {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {statItems.map((item) => (
        <Card key={item.key} className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  item.bgColor
                )}
              >
                <item.icon className={cn("h-5 w-5", item.color)} />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {stats[item.key]}
                  {item.suffix && (
                    <span className="text-sm font-normal text-muted-foreground">
                      {item.suffix}
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

