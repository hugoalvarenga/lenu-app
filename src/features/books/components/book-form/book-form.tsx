"use client";

import { useTransition, useState, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, X, BookOpen } from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  Input,
  Label,
  Textarea,
} from "@/shared/components/ui";
import { cn } from "@/shared/lib/utils";
import {
  createBookSchema,
  type CreateBookInput,
} from "../../schemas/book.schema";
import {
  createBookAction,
  updateBookAction,
  uploadCoverAction,
} from "../../server-actions";
import type { Book } from "../../types";

interface BookFormProps {
  book?: Book;
  onSuccess?: () => void;
}

export function BookForm({ book, onSuccess }: BookFormProps) {
  const [isPending, startTransition] = useTransition();
  const [coverUrl, setCoverUrl] = useState<string | null>(book?.cover_url || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateBookInput>({
    resolver: zodResolver(createBookSchema),
    defaultValues: book
      ? {
          title: book.title,
          author: book.author || "",
          isbn: book.isbn || "",
          description: book.description || "",
        }
      : undefined,
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadCoverAction(formData);

    if (result.success && result.data) {
      setCoverUrl(result.data);
      toast.success("Imagem enviada com sucesso");
    } else {
      toast.error(result.error || "Erro ao enviar imagem");
    }

    setIsUploading(false);
  };

  const onSubmit = (data: CreateBookInput) => {
    startTransition(async () => {
      const result = book
        ? await updateBookAction(book.id, data, coverUrl)
        : await createBookAction(data, coverUrl);

      if (result.success) {
        toast.success(result.message);
        if (!book) {
          reset();
          setCoverUrl(null);
        }
        onSuccess?.();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label>Capa do livro</Label>
        <div
          className={cn(
            "relative flex aspect-3/4 w-full max-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted/50 transition-colors hover:border-primary/50 mx-auto",
            isUploading && "pointer-events-none opacity-50"
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          {coverUrl ? (
            <>
              <Image
                src={coverUrl}
                alt="Capa do livro"
                fill
                className="object-cover"
                unoptimized={coverUrl.includes("127.0.0.1") || coverUrl.includes("localhost")}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCoverUrl(null);
                }}
                className="absolute right-2 top-2 rounded-full bg-background/80 p-1 hover:bg-background"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 p-4 text-center">
              {isUploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Clique para adicionar
                  </span>
                </>
              )}
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          placeholder="Nome do livro"
          disabled={isPending}
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="author">Autor</Label>
        <Input
          id="author"
          placeholder="Nome do autor"
          disabled={isPending}
          {...register("author")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="isbn">ISBN</Label>
        <Input
          id="isbn"
          placeholder="000-0-00-000000-0"
          disabled={isPending}
          {...register("isbn")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          placeholder="Descrição do livro"
          rows={3}
          disabled={isPending}
          {...register("description")}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isPending || isUploading}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : book ? (
            "Atualizar"
          ) : (
            "Cadastrar"
          )}
        </Button>
      </div>
    </form>
  );
}
