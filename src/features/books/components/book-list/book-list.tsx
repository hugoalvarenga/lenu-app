"use client";

import { useState } from "react";
import { Plus, BookOpen } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { BookCard } from "../book-card";
import { BookDialog } from "../book-dialog";
import type { Book } from "../../types";

interface BookListProps {
  books: Book[];
}

export function BookList({ books }: BookListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>();

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingBook(undefined);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Livros</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Gerencie seu catálogo de livros
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Novo livro
        </Button>
      </div>

      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <h3 className="mb-1 font-medium">Nenhum livro cadastrado</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Comece adicionando seu primeiro livro
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar livro
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {books.map((book) => (
            <BookCard key={book.id} book={book} onEdit={handleEdit} />
          ))}
        </div>
      )}

      <BookDialog
        open={dialogOpen}
        onOpenChange={handleClose}
        book={editingBook}
      />
    </div>
  );
}
