"use client";

import { format, parseISO, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui";
import { cn } from "@/shared/lib/utils";
import type { RentalHistory as RentalHistoryType } from "../../services/customer-analytics.service";

interface RentalHistoryProps {
  rentals: RentalHistoryType[];
}

const statusConfig = {
  active: {
    label: "Ativo",
    className: "border-amber-500/50 bg-amber-500/10 text-amber-500",
  },
  completed: {
    label: "Devolvido",
    className: "border-emerald-500/50 bg-emerald-500/10 text-emerald-500",
  },
  cancelled: {
    label: "Cancelado",
    className: "border-gray-500/50 bg-gray-500/10 text-gray-500",
  },
  overdue: {
    label: "Em Atraso",
    className: "border-red-500/50 bg-red-500/10 text-red-500",
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
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Histórico de Aluguéis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-muted-foreground">
              Este cliente ainda não realizou nenhum aluguel
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">Histórico de Aluguéis</CardTitle>
      </CardHeader>
      <CardContent className="p-0 md:p-6 md:pt-0">
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Livro</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Devolução</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentals.map((rental) => {
                const displayStatus = getDisplayStatus(rental);
                const status = statusConfig[displayStatus];

                return (
                  <TableRow key={rental.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-9 overflow-hidden rounded bg-muted">
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
                        <div>
                          <p className="font-medium">{rental.book.title}</p>
                          {rental.book.author && (
                            <p className="text-sm text-muted-foreground">
                              {rental.book.author}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(parseISO(rental.start_date), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>
                      {rental.actual_return_date
                        ? format(
                            parseISO(rental.actual_return_date),
                            "dd/MM/yyyy",
                            { locale: ptBR }
                          )
                        : format(
                            parseISO(rental.expected_return_date),
                            "dd/MM/yyyy",
                            { locale: ptBR }
                          )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("border", status.className)}
                      >
                        {status.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {rentals.map((rental) => {
            const displayStatus = getDisplayStatus(rental);
            const status = statusConfig[displayStatus];

            return (
              <div
                key={rental.id}
                className="flex items-center gap-3 rounded-lg border border-border/50 p-3"
              >
                <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded bg-muted">
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
                      <BookOpen className="h-5 w-5 text-muted-foreground/50" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{rental.book.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(parseISO(rental.start_date), "dd/MM/yy")} -{" "}
                    {rental.actual_return_date
                      ? format(parseISO(rental.actual_return_date), "dd/MM/yy")
                      : format(
                          parseISO(rental.expected_return_date),
                          "dd/MM/yy"
                        )}
                  </p>
                  <Badge
                    variant="outline"
                    className={cn("border text-xs mt-1", status.className)}
                  >
                    {status.label}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

