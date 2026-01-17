"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui";
import { BookForm } from "../book-form";
import type { Book } from "../../types";

interface BookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book?: Book;
}

export function BookDialog({ open, onOpenChange, book }: BookDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{book ? "Editar livro" : "Novo livro"}</DialogTitle>
        </DialogHeader>
        <BookForm book={book} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
