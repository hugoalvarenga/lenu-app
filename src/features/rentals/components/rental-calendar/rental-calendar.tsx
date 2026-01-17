"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  Views,
  type View,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@/shared/components/ui";
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
      .filter((rental) => rental.status === "active" || rental.status === "returned")
      .map((rental) => {
        const start = parseISO(rental.start_date);
        const end = rental.actual_return_date
          ? parseISO(rental.actual_return_date)
          : parseISO(rental.expected_return_date);
        const today = new Date();
        const isOverdue =
          rental.status === "active" && end < today;

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

  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    let backgroundColor = "hsl(var(--primary))";
    let borderColor = "hsl(var(--primary))";

    if (event.rental.status === "returned") {
      backgroundColor = "hsl(142.1 76.2% 36.3%)";
      borderColor = "hsl(142.1 76.2% 36.3%)";
    } else if (event.isOverdue) {
      backgroundColor = "hsl(0 84.2% 60.2%)";
      borderColor = "hsl(0 84.2% 60.2%)";
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderRadius: "4px",
        opacity: 0.9,
        color: "white",
        border: "none",
        display: "block",
      },
    };
  }, []);

  const handleNavigate = useCallback((newDate: Date) => {
    setDate(newDate);
  }, []);

  const handleViewChange = useCallback((newView: View) => {
    setView(newView);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Calendário</h1>
          <p className="text-muted-foreground">
            Visualize os aluguéis no calendário
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>Novo aluguel</Button>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-primary" />
          <span className="text-muted-foreground">Ativo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-emerald-500" />
          <span className="text-muted-foreground">Devolvido</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-red-500" />
          <span className="text-muted-foreground">Atrasado</span>
        </div>
      </div>

      <div
        className={cn(
          "rounded-lg border border-border/50 bg-background p-4",
          "[&_.rbc-toolbar]:mb-4 [&_.rbc-toolbar]:flex [&_.rbc-toolbar]:flex-wrap [&_.rbc-toolbar]:items-center [&_.rbc-toolbar]:justify-between [&_.rbc-toolbar]:gap-2",
          "[&_.rbc-toolbar_button]:rounded-md [&_.rbc-toolbar_button]:border [&_.rbc-toolbar_button]:border-input [&_.rbc-toolbar_button]:bg-background [&_.rbc-toolbar_button]:px-3 [&_.rbc-toolbar_button]:py-1.5 [&_.rbc-toolbar_button]:text-sm [&_.rbc-toolbar_button]:font-medium [&_.rbc-toolbar_button]:transition-colors [&_.rbc-toolbar_button]:hover:bg-accent",
          "[&_.rbc-toolbar_button.rbc-active]:bg-primary [&_.rbc-toolbar_button.rbc-active]:text-primary-foreground",
          "[&_.rbc-btn-group]:flex [&_.rbc-btn-group]:gap-1",
          "[&_.rbc-toolbar-label]:text-lg [&_.rbc-toolbar-label]:font-semibold",
          "[&_.rbc-header]:border-border/50 [&_.rbc-header]:py-2 [&_.rbc-header]:text-sm [&_.rbc-header]:font-medium [&_.rbc-header]:text-muted-foreground",
          "[&_.rbc-month-view]:border-border/50",
          "[&_.rbc-day-bg]:border-border/50",
          "[&_.rbc-off-range-bg]:bg-muted/30",
          "[&_.rbc-today]:bg-primary/5",
          "[&_.rbc-date-cell]:p-1 [&_.rbc-date-cell]:text-sm",
          "[&_.rbc-date-cell.rbc-now]:font-semibold",
          "[&_.rbc-event]:text-xs",
          "[&_.rbc-show-more]:text-xs [&_.rbc-show-more]:text-primary [&_.rbc-show-more]:font-medium"
        )}
      >
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700 }}
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
        />
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
