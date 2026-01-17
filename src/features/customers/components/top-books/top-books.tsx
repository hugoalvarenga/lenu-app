"use client";

import Image from "next/image";
import { BookOpen, Trophy } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { TopBook } from "../../services/customer-analytics.service";

interface TopBooksProps {
  books: TopBook[];
}

export function TopBooks({ books }: TopBooksProps) {
  if (books.length === 0) {
    return (
      <div className="rounded-xl border border-border/50 bg-card">
        <div className="border-b border-border/50 px-6 py-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            <h3 className="font-semibold">Livros Favoritos</h3>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <BookOpen className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Nenhum livro alugado ainda
          </p>
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...books.map((b) => b.rental_count));

  return (
    <div className="rounded-xl border border-border/50 bg-card">
      <div className="border-b border-border/50 px-6 py-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-500" />
          <h3 className="font-semibold">Livros Favoritos</h3>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {books.map((book, index) => {
          const barWidth = (book.rental_count / maxCount) * 100;
          const isFirst = index === 0;

          return (
            <div
              key={book.book_id}
              className={cn(
                "relative overflow-hidden rounded-lg p-3 transition-colors",
                isFirst
                  ? "bg-primary/5 ring-1 ring-primary/10"
                  : "bg-muted/30 hover:bg-muted/50"
              )}
            >
              <div
                className={cn(
                  "absolute inset-y-0 left-0 transition-all",
                  isFirst ? "bg-primary/10" : "bg-muted/50"
                )}
                style={{ width: `${barWidth}%` }}
              />

              <div className="relative flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    isFirst
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {index + 1}
                </div>

                <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded bg-background shadow-sm">
                  {book.cover_url ? (
                    <Image
                      src={book.cover_url}
                      alt={book.title}
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
                  <p
                    className={cn(
                      "truncate text-sm font-medium leading-tight",
                      isFirst && "text-primary"
                    )}
                  >
                    {book.title}
                  </p>
                  {book.author && (
                    <p className="truncate text-xs text-muted-foreground">
                      {book.author}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <span
                    className={cn(
                      "text-lg font-semibold tabular-nums",
                      isFirst ? "text-primary" : "text-foreground"
                    )}
                  >
                    {book.rental_count}
                  </span>
                  <span className="text-xs text-muted-foreground">×</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
