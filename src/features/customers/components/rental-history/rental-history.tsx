"use client";

import { format, parseISO, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";
import { Badge } from "@/shared/components/ui";
import { cn } from "@/shared/lib/utils";
import type { RentalHistory as RentalHistoryType } from "../../services/customer-analytics.service";

interface RentalHistoryProps {
  rentals: RentalHistoryType[];
}

const statusConfig = {
  active: {
    label: "Ativo",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-500 border-0",
  },
  completed: {
    label: "Devolvido",
    className:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-0",
  },
  cancelled: {
    label: "Cancelado",
    className: "bg-muted text-muted-foreground border-0",
  },
  overdue: {
    label: "Em Atraso",
    className: "bg-red-500/10 text-red-600 dark:text-red-500 border-0",
  },
};

export function RentalHistory({ rentals }: RentalHistoryProps) {
  const getDisplayStatus = (rental: RentalHistoryType) => {
    if (rental.status === "active") {
      const expectedReturn = parseISO(rental.expected_return_date);
      if (isPast(expectedReturn)) {
        return "overdue";
      }
    }
    return rental.status;
  };

  if (rentals.length === 0) {
    return (
      <div className="rounded-xl border border-border/50 bg-card">
        <div className="border-b border-border/50 px-6 py-4">
          <h3 className="font-semibold">Histórico de Aluguéis</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <BookOpen className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Este cliente ainda não realizou nenhum aluguel
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card">
      <div className="border-b border-border/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Histórico de Aluguéis</h3>
          <span className="text-xs text-muted-foreground tabular-nums">
            {rentals.length} {rentals.length === 1 ? "registro" : "registros"}
          </span>
        </div>
      </div>

      <div className="divide-y divide-border/50">
        {rentals.map((rental) => {
          const displayStatus = getDisplayStatus(rental);
          const status = statusConfig[displayStatus];

          return (
            <div
              key={rental.id}
              className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/30"
            >
              <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                {rental.book.cover_url ? (
                  <Image
                    src={rental.book.cover_url}
                    alt={rental.book.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <BookOpen className="h-4 w-4 text-muted-foreground/50" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium leading-tight">
                  {rental.book.title}
                </p>
                {rental.book.author && (
                  <p className="truncate text-sm text-muted-foreground">
                    {rental.book.author}
                  </p>
                )}
              </div>

              <div className="hidden items-center gap-2 text-xs text-muted-foreground md:flex">
                <Calendar className="h-3.5 w-3.5" />
                <span className="tabular-nums">
                  {format(parseISO(rental.start_date), "dd MMM", {
                    locale: ptBR,
                  })}
                </span>
                <ArrowRight className="h-3 w-3" />
                <span className="tabular-nums">
                  {rental.actual_return_date
                    ? format(parseISO(rental.actual_return_date), "dd MMM", {
                        locale: ptBR,
                      })
                    : format(parseISO(rental.expected_return_date), "dd MMM", {
                        locale: ptBR,
                      })}
                </span>
              </div>

              <Badge variant="secondary" className={cn("shrink-0", status.className)}>
                {status.label}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}
