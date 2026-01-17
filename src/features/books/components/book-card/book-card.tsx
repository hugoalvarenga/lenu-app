"use client";

import { useTransition } from "react";
import Image from "next/image";
import { MoreVertical, Pencil, Trash2, BookOpen } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui";
import { cn } from "@/shared/lib/utils";
import type { Book } from "../../types";
import { deleteBookAction } from "../../server-actions";

interface BookCardProps {
  book: Book;
  onEdit?: (book: Book) => void;
}

const statusConfig = {
  available: {
    label: "Disponível",
    variant: "default" as const,
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  rented: {
    label: "Alugado",
    variant: "secondary" as const,
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  unavailable: {
    label: "Indisponível",
    variant: "outline" as const,
    className: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  },
};

export function BookCard({ book, onEdit }: BookCardProps) {
  const [isPending, startTransition] = useTransition();
  const status = statusConfig[book.status];

  const handleDelete = () => {
    if (!confirm("Tem certeza que deseja excluir este livro?")) return;

    startTransition(async () => {
      const result = await deleteBookAction(book.id);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-border/50 transition-all hover:border-border pt-0 pb-0",
        isPending && "opacity-50"
      )}
    >
      <CardContent className="p-0">
        <div className="relative aspect-[3/4] bg-muted">
          {book.cover_url ? (
            <Image
              src={book.cover_url}
              alt={book.title}
              fill
              className="object-cover"
              unoptimized={book.cover_url.includes("127.0.0.1") || book.cover_url.includes("localhost")}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute right-2 top-2">
            <Badge
              variant={status.variant}
              className={cn("border text-xs", status.className)}
            >
              {status.label}
            </Badge>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-medium leading-tight">
                {book.title}
              </h3>
              {book.author && (
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {book.author}
                </p>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0 opacity-0 group-hover:opacity-100"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(book)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {book.isbn && (
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              ISBN: {book.isbn}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
