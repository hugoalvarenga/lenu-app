"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2, User } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui";
import { searchCustomersAction } from "../../server-actions";
import type { Customer } from "../../types";

interface CustomerComboboxProps {
  value?: string;
  onSelect: (customerId: string, customer: Customer | null) => void;
  disabled?: boolean;
  initialCustomers?: Customer[];
}

export function CustomerCombobox({
  value,
  onSelect,
  disabled,
  initialCustomers = [],
}: CustomerComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [customers, setCustomers] = React.useState<Customer[]>(initialCustomers);
  const [isLoading, setIsLoading] = React.useState(false);

  const selectedCustomer = customers.find((c) => c.id === value);

  React.useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      const result = await searchCustomersAction(search);
      if (result.success && result.data) {
        setCustomers(result.data);
      }
      setIsLoading(false);
    };

    const timeoutId = setTimeout(fetchCustomers, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
          disabled={disabled}
          size={'lg'}
        >
          {selectedCustomer ? (
            <div className="flex items-baseline gap-2 text-left">
              <span className="text-sm font-medium">{selectedCustomer.name}</span>
              <span className="text-xs text-muted-foreground">
                {selectedCustomer.email || selectedCustomer.phone}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground">Buscar cliente...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Buscar por nome, email ou telefone..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : customers.length === 0 ? (
              <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
            ) : (
              <CommandGroup>
                {customers.map((customer) => (
                  <CommandItem
                    key={customer.id}
                    value={customer.id}
                    onSelect={() => {
                      onSelect(customer.id, customer);
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{customer.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {customer.email && `${customer.email} • `}
                          {customer.phone}
                        </span>
                      </div>
                    </div>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 ml-auto",
                        value === customer.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
