"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button, Input, Label, Textarea } from "@/shared/components/ui";
import {
  createCustomerSchema,
  type CreateCustomerInput,
} from "../../schemas/customer.schema";
import {
  createCustomerAction,
  updateCustomerAction,
} from "../../server-actions";
import type { Customer } from "../../types";

interface CustomerFormProps {
  customer?: Customer;
  onSuccess?: () => void;
}

export function CustomerForm({ customer, onSuccess }: CustomerFormProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCustomerInput>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: customer
      ? {
          name: customer.name,
          email: customer.email || "",
          phone: customer.phone || "",
          address: customer.address || "",
        }
      : undefined,
  });

  const onSubmit = (data: CreateCustomerInput) => {
    startTransition(async () => {
      const result = customer
        ? await updateCustomerAction(customer.id, data)
        : await createCustomerAction(data);

      if (result.success) {
        toast.success(result.message);
        if (!customer) {
          reset();
        }
        onSuccess?.();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          placeholder="Nome do cliente"
          disabled={isPending}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="email@exemplo.com"
          disabled={isPending}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          placeholder="(00) 00000-0000"
          disabled={isPending}
          {...register("phone")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Endereço</Label>
        <Textarea
          id="address"
          placeholder="Endereço completo"
          rows={2}
          disabled={isPending}
          {...register("address")}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : customer ? (
            "Atualizar"
          ) : (
            "Cadastrar"
          )}
        </Button>
      </div>
    </form>
  );
}
