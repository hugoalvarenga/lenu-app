"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  Views,
  type View,
} from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  parseISO,
  isPast,
  differenceInDays,
  isToday,
  isTomorrow,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./rental-calendar.css";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  CalendarDays,
} from "lucide-react";
import { Button, Badge } from "@/shared/components/ui";
import { cn } from "@/shared/lib/utils";
import { RentalDialog } from "../rental-dialog";
import type { RentalWithRelations } from "../../types";
import type { Book } from "@/features/books";
import type { Customer } from "@/features/customers";

const locales = {
  "pt-BR": ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  rental: RentalWithRelations;
  isOverdue: boolean;
}

interface RentalCalendarProps {
  rentals: RentalWithRelations[];
  books: Book[];
  customers: Customer[];
}

const messages = {
  allDay: "Dia inteiro",
  previous: "Anterior",
  next: "Próximo",
  today: "Hoje",
  month: "Mês",
  week: "Semana",
  day: "Dia",
  agenda: "Agenda",
  date: "Data",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "Não há aluguéis neste período",
  showMore: (total: number) => `+ ${total} mais`,
};

export function RentalCalendar({
  rentals,
  books,
  customers,
}: RentalCalendarProps) {
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);

  const events: CalendarEvent[] = useMemo(() => {
    return rentals
      .filter(
        (rental) => rental.status === "active" || rental.status === "returned"
      )
      .map((rental) => {
        const start = parseISO(rental.start_date);
        const end = rental.actual_return_date
          ? parseISO(rental.actual_return_date)
          : parseISO(rental.expected_return_date);
        const today = new Date();
        const isOverdue = rental.status === "active" && end < today;

        return {
          id: rental.id,
          title: `${rental.book.title} - ${rental.customer.name}`,
          start,
          end,
          rental,
          isOverdue,
        };
      });
  }, [rentals]);

  const upcomingReturns = useMemo(() => {
    return rentals
      .filter((rental) => rental.status === "active")
      .map((rental) => ({
        ...rental,
        expectedDate: parseISO(rental.expected_return_date),
        daysRemaining: differenceInDays(
          parseISO(rental.expected_return_date),
          new Date()
        ),
      }))
      .sort((a, b) => a.expectedDate.getTime() - b.expectedDate.getTime())
      .slice(0, 5);
  }, [rentals]);

  const stats = useMemo(() => {
    const active = rentals.filter((r) => r.status === "active").length;
    const overdue = rentals.filter(
      (r) =>
        r.status === "active" && isPast(parseISO(r.expected_return_date))
    ).length;
    const returned = rentals.filter((r) => r.status === "returned").length;
    return { active, overdue, returned };
  }, [rentals]);

  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    let backgroundColor = "#0ea5e9";

    if (event.rental.status === "returned") {
      backgroundColor = "#22c55e";
    } else if (event.isOverdue) {
      backgroundColor = "#ef4444";
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "4px",
        color: "#ffffff",
        border: "none",
        display: "block",
        fontSize: "11px",
        padding: "3px 8px",
        fontWeight: 500,
        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
      },
    };
  }, []);

  const handleNavigate = useCallback((newDate: Date) => {
    setDate(newDate);
  }, []);

  const handleViewChange = useCallback((newView: View) => {
    setView(newView);
  }, []);

  const goToToday = () => setDate(new Date());
  const goToPrev = () => {
    const newDate = new Date(date);
    if (view === Views.MONTH) {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setDate(newDate);
  };
  const goToNext = () => {
    const newDate = new Date(date);
    if (view === Views.MONTH) {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setDate(newDate);
  };

  const getDateLabel = (rental: (typeof upcomingReturns)[0]) => {
    if (isToday(rental.expectedDate)) return "Hoje";
    if (isTomorrow(rental.expectedDate)) return "Amanhã";
    if (rental.daysRemaining < 0)
      return `${Math.abs(rental.daysRemaining)} dias atrás`;
    return `${rental.daysRemaining} dias`;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Calendário</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie os aluguéis
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Novo aluguel
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-border/50 bg-card">
            <div className="flex flex-col gap-4 border-b border-border/50 p-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPrev}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNext}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToToday}
                  className="h-8"
                >
                  Hoje
                </Button>
                <h2 className="ml-2 text-lg font-semibold capitalize">
                  {format(date, view === Views.MONTH ? "MMMM yyyy" : "'Semana de' d MMM", {
                    locale: ptBR,
                  })}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex rounded-lg border border-border/50 p-1">
                  <button
                    onClick={() => setView(Views.MONTH)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      view === Views.MONTH
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Mês
                  </button>
                  <button
                    onClick={() => setView(Views.WEEK)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      view === Views.WEEK
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Semana
                  </button>
                </div>
              </div>
            </div>

            <div className="rental-calendar p-4">
              <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                view={view}
                date={date}
                onNavigate={handleNavigate}
                onView={handleViewChange}
                views={[Views.MONTH, Views.WEEK]}
                messages={messages}
                culture="pt-BR"
                eventPropGetter={eventStyleGetter}
                popup
                selectable={false}
                toolbar={false}
              />
            </div>

            <div className="flex items-center gap-6 border-t border-border/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded" style={{ backgroundColor: "#0ea5e9" }} />
                <span className="text-xs text-muted-foreground">Ativo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded" style={{ backgroundColor: "#22c55e" }} />
                <span className="text-xs text-muted-foreground">Devolvido</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded" style={{ backgroundColor: "#ef4444" }} />
                <span className="text-xs text-muted-foreground">Atrasado</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
            <div className="rounded-xl border border-border/50 bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold tabular-nums">
                    {stats.active}
                  </p>
                  <p className="text-xs text-muted-foreground">Ativos</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border/50 bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold tabular-nums">
                    {stats.returned}
                  </p>
                  <p className="text-xs text-muted-foreground">Devolvidos</p>
                </div>
              </div>
            </div>

            <div
              className={cn(
                "rounded-xl border bg-card p-4",
                stats.overdue > 0
                  ? "border-red-500/30 bg-red-500/5"
                  : "border-border/50"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg",
                    stats.overdue > 0 ? "bg-red-500/10" : "bg-muted"
                  )}
                >
                  <AlertTriangle
                    className={cn(
                      "h-4 w-4",
                      stats.overdue > 0
                        ? "text-red-600"
                        : "text-muted-foreground"
                    )}
                  />
                </div>
                <div>
                  <p
                    className={cn(
                      "text-2xl font-semibold tabular-nums",
                      stats.overdue > 0 && "text-red-600"
                    )}
                  >
                    {stats.overdue}
                  </p>
                  <p className="text-xs text-muted-foreground">Em atraso</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border/50 bg-card">
            <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
              <CalendarDays className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Próximas Devoluções</h3>
            </div>

            {upcomingReturns.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <BookOpen className="mb-2 h-6 w-6 text-muted-foreground/30" />
                <p className="text-xs text-muted-foreground">
                  Nenhuma devolução pendente
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {upcomingReturns.map((rental) => (
                  <div
                    key={rental.id}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {rental.book.title}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {rental.customer.name}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "ml-2 shrink-0 text-xs",
                        rental.daysRemaining < 0
                          ? "border-0 bg-red-500/10 text-red-600"
                          : rental.daysRemaining <= 2
                            ? "border-0 bg-orange-500/10 text-orange-600"
                            : "border-0 bg-muted text-muted-foreground"
                      )}
                    >
                      {getDateLabel(rental)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <RentalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        books={books}
        customers={customers}
      />
    </div>
  );
}
