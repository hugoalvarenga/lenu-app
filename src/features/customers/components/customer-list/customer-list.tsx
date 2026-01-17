"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Plus,
  Users,
  MoreVertical,
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui";
import { cn } from "@/shared/lib/utils";
import { CustomerDialog } from "../customer-dialog";
import { deleteCustomerAction } from "../../server-actions";
import type { Customer } from "../../types";

interface CustomerListProps {
  customers: Customer[];
}

export function CustomerList({ customers }: CustomerListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>();
  const [isPending, startTransition] = useTransition();

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingCustomer(undefined);
  };

  const handleDelete = (customer: Customer) => {
    if (!confirm(`Tem certeza que deseja excluir "${customer.name}"?`)) return;

    startTransition(async () => {
      const result = await deleteCustomerAction(customer.id);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Clientes</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Gerencie os clientes que alugam seus livros
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Novo cliente
        </Button>
      </div>

      {customers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <Users className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <h3 className="mb-1 font-medium">Nenhum cliente cadastrado</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Comece adicionando seu primeiro cliente
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar cliente
          </Button>
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {customers.map((customer) => (
            <Card
              key={customer.id}
              className={cn(
                "group border-border/50 transition-all hover:border-border py-0",
                isPending && "opacity-50"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium">{customer.name}</h3>
                    <div className="mt-2 space-y-1">
                      {customer.email && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3.5 w-3.5" />
                          <span className="truncate">{customer.email}</span>
                        </div>
                      )}
                      {customer.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                      {customer.address && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span className="line-clamp-1">{customer.address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="shrink-0 sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/customers/${customer.id}`}>
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Ver histórico
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEdit(customer)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(customer)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CustomerDialog
        open={dialogOpen}
        onOpenChange={handleClose}
        customer={editingCustomer}
      />
    </div>
  );
}
