"use client";

import {
  BookOpen,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { CustomerStats as CustomerStatsType } from "../../services/customer-analytics.service";

interface CustomerStatsProps {
  stats: CustomerStatsType;
}

export function CustomerStats({ stats }: CustomerStatsProps) {
  const primaryStats = [
    {
      key: "totalRentals" as const,
      label: "Total de Aluguéis",
      value: stats.totalRentals,
      icon: BookOpen,
    },
    {
      key: "averageRentalDays" as const,
      label: "Média de Dias",
      value: stats.averageRentalDays,
      suffix: "dias",
      icon: TrendingUp,
    },
  ];

  const secondaryStats = [
    {
      key: "activeRentals" as const,
      label: "Ativos",
      value: stats.activeRentals,
      icon: Clock,
      variant: "warning" as const,
    },
    {
      key: "completedRentals" as const,
      label: "Devolvidos",
      value: stats.completedRentals,
      icon: CheckCircle,
      variant: "success" as const,
    },
    {
      key: "overdueRentals" as const,
      label: "Em Atraso",
      value: stats.overdueRentals,
      icon: AlertTriangle,
      variant: "danger" as const,
    },
    {
      key: "cancelledRentals" as const,
      label: "Cancelados",
      value: stats.cancelledRentals,
      icon: XCircle,
      variant: "muted" as const,
    },
  ];

  const variantStyles = {
    warning: "text-amber-600 dark:text-amber-500",
    success: "text-emerald-600 dark:text-emerald-500",
    danger: "text-red-600 dark:text-red-500",
    muted: "text-muted-foreground",
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        {primaryStats.map((stat) => (
          <div
            key={stat.key}
            className="group relative overflow-hidden rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-border"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-semibold tracking-tight">
                    {stat.value}
                  </span>
                  {stat.suffix && (
                    <span className="text-sm text-muted-foreground">
                      {stat.suffix}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border/50 bg-card">
        <div className="grid grid-cols-2 divide-x divide-border/50 md:grid-cols-4">
          {secondaryStats.map((stat, index) => (
            <div
              key={stat.key}
              className={cn(
                "flex flex-col items-center justify-center p-4 text-center",
                index >= 2 && "border-t border-border/50 md:border-t-0"
              )}
            >
              <stat.icon
                className={cn("h-4 w-4 mb-2", variantStyles[stat.variant])}
              />
              <span
                className={cn(
                  "text-2xl font-semibold tabular-nums",
                  variantStyles[stat.variant]
                )}
              >
                {stat.value}
              </span>
              <span className="mt-1 text-xs text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
