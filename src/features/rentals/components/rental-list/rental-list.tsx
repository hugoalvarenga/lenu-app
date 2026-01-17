"use client";

import { useState, useTransition } from "react";
import { format, parseISO, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Plus,
  BookOpen,
  MoreVertical,
  CheckCircle,
  XCircle,
  Calendar,
  User,
} from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  Badge,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui";
import { cn } from "@/shared/lib/utils";
import { RentalDialog } from "../rental-dialog";
import { returnBookAction, cancelRentalAction } from "../../server-actions";
import type { RentalWithRelations, RentalStatus } from "../../types";
import type { Book } from "@/features/books";
import type { Customer } from "@/features/customers";

interface RentalListProps {
  rentals: RentalWithRelations[];
  books: Book[];
  customers: Customer[];
}

const statusConfig: Record<
  RentalStatus,
  { label: string; className: string }
> = {
  active: {
    label: "Ativo",
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  returned: {
    label: "Devolvido",
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  overdue: {
    label: "Atrasado",
    className: "bg-red-500/10 text-red-600 border-red-500/20",
  },
  cancelled: {
    label: "Cancelado",
    className: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  },
};

export function RentalList({ rentals, books, customers }: RentalListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleReturn = (rental: RentalWithRelations) => {
    if (!confirm(`Confirmar devolução de "${rental.book.title}"?`)) return;

    startTransition(async () => {
      const result = await returnBookAction(rental.id);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleCancel = (rental: RentalWithRelations) => {
    if (!confirm(`Tem certeza que deseja cancelar este aluguel?`)) return;

    startTransition(async () => {
      const result = await cancelRentalAction(rental.id);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    });
  };

  const getDisplayStatus = (rental: RentalWithRelations): RentalStatus => {
    if (rental.status === "active") {
      const isOverdue = isPast(parseISO(rental.expected_return_date));
      return isOverdue ? "overdue" : "active";
    }
    return rental.status;
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Aluguéis</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Gerencie os aluguéis dos seus livros
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Novo aluguel
        </Button>
      </div>

      {rentals.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <h3 className="mb-1 font-medium">Nenhum aluguel registrado</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Comece registrando seu primeiro aluguel
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Registrar aluguel
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {rentals.map((rental) => {
              const displayStatus = getDisplayStatus(rental);
              const status = statusConfig[displayStatus];

              return (
                <Card
                  key={rental.id}
                  className={cn(
                    "border-border/50",
                    isPending && "opacity-50"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium truncate">{rental.book.title}</h3>
                          <Badge
                            variant="outline"
                            className={cn("border shrink-0", status.className)}
                          >
                            {status.label}
                          </Badge>
                        </div>
                        {rental.book.author && (
                          <p className="text-sm text-muted-foreground">
                            {rental.book.author}
                          </p>
                        )}
                        <div className="mt-3 space-y-1.5">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-3.5 w-3.5" />
                            <span>{rental.customer.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                              {format(parseISO(rental.start_date), "dd/MM", {
                                locale: ptBR,
                              })}{" "}
                              -{" "}
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
                            </span>
                          </div>
                        </div>
                      </div>

                      {rental.status === "active" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm" className="shrink-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleReturn(rental)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Registrar devolução
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleCancel(rental)}
                              className="text-destructive focus:text-destructive"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Cancelar aluguel
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="hidden rounded-lg border border-border/50 md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Livro</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Início</TableHead>
                  <TableHead>Devolução</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentals.map((rental) => {
                  const displayStatus = getDisplayStatus(rental);
                  const status = statusConfig[displayStatus];

                  return (
                    <TableRow
                      key={rental.id}
                      className={cn(isPending && "opacity-50")}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{rental.book.title}</p>
                          {rental.book.author && (
                            <p className="text-sm text-muted-foreground">
                              {rental.book.author}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{rental.customer.name}</TableCell>
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
                      <TableCell>
                        {rental.status === "active" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon-sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleReturn(rental)}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Registrar devolução
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleCancel(rental)}
                                className="text-destructive focus:text-destructive"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancelar aluguel
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <RentalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        books={books}
        customers={customers}
      />
    </div>
  );
}
