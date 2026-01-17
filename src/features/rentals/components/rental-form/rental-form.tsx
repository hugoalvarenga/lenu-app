"use client";

import * as React from "react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, isWithinInterval, eachDayOfInterval, isBefore, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";
import {
  Button,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/shared/components/ui";
import { RentalCalendar } from "./components/rental-calendar";
import {
  createRentalSchema,
  type CreateRentalInput,
} from "../../schemas/rental.schema";
import { createRentalAction, getBlockedDatesAction } from "../../server-actions";
import { CustomerCombobox } from "@/features/customers/components/customer-combobox";
import type { Book } from "@/features/books";
import type { Customer } from "@/features/customers";
import type { BlockedDateRange } from "../../services/rental.service";

interface RentalFormProps {
  books: Book[];
  customers: Customer[];
  onSuccess?: () => void;
}

export function RentalForm({ books, customers, onSuccess }: RentalFormProps) {
  const [isPending, startTransition] = useTransition();
  const [blockedDates, setBlockedDates] = React.useState<BlockedDateRange[]>([]);
  const [isLoadingDates, setIsLoadingDates] = React.useState(false);
  const [startDateOpen, setStartDateOpen] = React.useState(false);
  const [endDateOpen, setEndDateOpen] = React.useState(false);

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateRentalInput>({
    resolver: zodResolver(createRentalSchema),
  });

  const selectedBookId = watch("book_id");
  const selectedCustomerId = watch("customer_id");
  const startDate = watch("start_date");
  const expectedReturnDate = watch("expected_return_date");

  React.useEffect(() => {
    if (selectedBookId) {
      setIsLoadingDates(true);
      getBlockedDatesAction(selectedBookId).then((result) => {
        if (result.success && result.data) {
          setBlockedDates(result.data);
        }
        setIsLoadingDates(false);
      });
    } else {
      setBlockedDates([]);
    }
  }, [selectedBookId]);

  const disabledDays = React.useMemo(() => {
    const disabled: Date[] = [];

    blockedDates.forEach(({ start, end }) => {
      const days = eachDayOfInterval({ start, end });
      disabled.push(...days);
    });

    return disabled;
  }, [blockedDates]);

  const isDateDisabled = React.useCallback(
    (date: Date) => {
      if (isBefore(date, startOfDay(new Date()))) {
        return true;
      }

      return disabledDays.some(
        (disabledDate) =>
          disabledDate.toDateString() === date.toDateString()
      );
    },
    [disabledDays]
  );

  const onSubmit = (data: CreateRentalInput) => {
    startTransition(async () => {
      const result = await createRentalAction(data);

      if (result.success) {
        toast.success(result.message);
        reset();
        onSuccess?.();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="book_id">Livro *</Label>
        <Select
          onValueChange={(value) => {
            setValue("book_id", value);
            setValue("start_date", "");
            setValue("expected_return_date", "");
          }}
          disabled={isPending}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um livro" />
          </SelectTrigger>
          <SelectContent>
            {books.length === 0 ? (
              <SelectItem value="none" disabled>
                Nenhum livro cadastrado
              </SelectItem>
            ) : (
              books.map((book) => (
                <SelectItem key={book.id} value={book.id}>
                  {book.title}
                  {book.author && ` - ${book.author}`}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {errors.book_id && (
          <p className="text-sm text-destructive">{errors.book_id.message}</p>
        )}
        {isLoadingDates && selectedBookId && (
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Carregando disponibilidade...
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="customer_id">Cliente *</Label>
        <CustomerCombobox
          value={selectedCustomerId}
          onSelect={(customerId) => setValue("customer_id", customerId)}
          disabled={isPending}
          initialCustomers={customers}
        />
        {errors.customer_id && (
          <p className="text-sm text-destructive">
            {errors.customer_id.message}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Data de início *</Label>
          <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
                disabled={isPending || !selectedBookId}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? (
                  format(new Date(startDate), "PPP", { locale: ptBR })
                ) : (
                  <span>Selecionar data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <RentalCalendar
                mode="single"
                selected={startDate ? new Date(startDate) : undefined}
                onSelect={(date) => {
                  if (date) {
                    setValue("start_date", format(date, "yyyy-MM-dd"));
                    if (expectedReturnDate && isBefore(new Date(expectedReturnDate), date)) {
                      setValue("expected_return_date", "");
                    }
                    setStartDateOpen(false);
                    setTimeout(() => setEndDateOpen(true), 150);
                  }
                }}
                disabled={isDateDisabled}
                locale={ptBR}
                blockedRanges={blockedDates}
              />
              {blockedDates.length > 0 && (
                <div className="border-t p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <span className="h-2 w-2 rounded-full bg-destructive/50" />
                    <span>Datas com aluguel ativo</span>
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>
          {errors.start_date && (
            <p className="text-sm text-destructive">
              {errors.start_date.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Devolução prevista *</Label>
          <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !expectedReturnDate && "text-muted-foreground"
                )}
                disabled={isPending || !startDate}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {expectedReturnDate ? (
                  format(new Date(expectedReturnDate), "PPP", { locale: ptBR })
                ) : (
                  <span>Selecionar data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <RentalCalendar
                mode="single"
                selected={expectedReturnDate ? new Date(expectedReturnDate) : undefined}
                onSelect={(date) => {
                  if (date) {
                    setValue("expected_return_date", format(date, "yyyy-MM-dd"));
                    setEndDateOpen(false);
                  }
                }}
                disabled={(date) => {
                  if (startDate && isBefore(date, new Date(startDate))) {
                    return true;
                  }
                  return isDateDisabled(date);
                }}
                locale={ptBR}
                blockedRanges={blockedDates}
                defaultMonth={startDate ? new Date(startDate) : undefined}
              />
            </PopoverContent>
          </Popover>
          {errors.expected_return_date && (
            <p className="text-sm text-destructive">
              {errors.expected_return_date.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          placeholder="Observações sobre o aluguel"
          rows={2}
          disabled={isPending}
          onChange={(e) => setValue("notes", e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="submit"
          disabled={isPending || books.length === 0}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Registrar aluguel"
          )}
        </Button>
      </div>
    </form>
  );
}
