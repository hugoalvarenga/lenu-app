import { notFound } from "next/navigation";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
} from "lucide-react";
import { Button } from "@/shared/components/ui";
import { getCustomerById } from "@/features/customers/services";
import {
  getCustomerStats,
  getCustomerRentalHistory,
  getCustomerTopBooks,
} from "@/features/customers/services/customer-analytics.service";
import { CustomerStats } from "@/features/customers/components/customer-stats";
import { RentalHistory } from "@/features/customers/components/rental-history";
import { TopBooks } from "@/features/customers/components/top-books";

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({
  params,
}: CustomerDetailPageProps) {
  const { id } = await params;

  const customer = await getCustomerById(id);

  if (!customer) {
    notFound();
  }

  const [stats, rentalHistory, topBooks] = await Promise.all([
    getCustomerStats(id),
    getCustomerRentalHistory(id),
    getCustomerTopBooks(id),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="shrink-0 -ml-2"
          >
            <Link href="/customers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>

          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {customer.name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Cliente desde{" "}
                {format(parseISO(customer.created_at), "MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border/50 bg-card">
        <div className="grid divide-y divide-border/50 md:grid-cols-3 md:divide-x md:divide-y-0">
          {customer.email && (
            <div className="flex items-center gap-3 px-6 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Email</p>
                <a
                  href={`mailto:${customer.email}`}
                  className="truncate text-sm font-medium hover:text-primary transition-colors"
                >
                  {customer.email}
                </a>
              </div>
            </div>
          )}

          {customer.phone && (
            <div className="flex items-center gap-3 px-6 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Phone className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Telefone</p>
                <a
                  href={`tel:${customer.phone}`}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {customer.phone}
                </a>
              </div>
            </div>
          )}

          {customer.address && (
            <div className="flex items-center gap-3 px-6 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Endereço</p>
                <p className="truncate text-sm font-medium">{customer.address}</p>
              </div>
            </div>
          )}

          {!customer.email && !customer.phone && !customer.address && (
            <div className="flex items-center justify-center px-6 py-8 md:col-span-3">
              <p className="text-sm text-muted-foreground">
                Nenhuma informação de contato cadastrada
              </p>
            </div>
          )}
        </div>
      </div>

      <CustomerStats stats={stats} />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RentalHistory rentals={rentalHistory} />
        </div>
        <div className="lg:col-span-2">
          <TopBooks books={topBooks} />
        </div>
      </div>
    </div>
  );
}
