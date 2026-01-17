"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui";
import { RentalForm } from "../rental-form";
import type { Book } from "@/features/books";
import type { Customer } from "@/features/customers";

interface RentalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  books: Book[];
  customers: Customer[];
}

export function RentalDialog({
  open,
  onOpenChange,
  books,
  customers,
}: RentalDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo aluguel</DialogTitle>
        </DialogHeader>
        <RentalForm
          books={books}
          customers={customers}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
