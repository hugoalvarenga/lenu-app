"use client";

import Image from "next/image";
import { BookOpen, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui";
import type { TopBook } from "../../services/customer-analytics.service";

interface TopBooksProps {
  books: TopBook[];
}

export function TopBooks({ books }: TopBooksProps) {
  if (books.length === 0) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5" />
            Livros Mais Alugados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-muted-foreground">
              Nenhum livro alugado ainda
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5" />
          Livros Mais Alugados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {books.map((book, index) => (
          <div
            key={book.book_id}
            className="flex items-center gap-4"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {index + 1}
            </div>
            <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded bg-muted">
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
                  <BookOpen className="h-5 w-5 text-muted-foreground/50" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{book.title}</p>
              {book.author && (
                <p className="text-sm text-muted-foreground truncate">
                  {book.author}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">{book.rental_count}</p>
              <p className="text-xs text-muted-foreground">
                {book.rental_count === 1 ? "vez" : "vezes"}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

