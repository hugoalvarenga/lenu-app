import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { Button, Card, CardContent } from "@/shared/components/ui";
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/customers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
            {customer.name}
          </h1>
          <p className="text-muted-foreground">Detalhes e histórico do cliente</p>
        </div>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-wrap gap-6">
            {customer.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`mailto:${customer.email}`}
                  className="text-primary hover:underline"
                >
                  {customer.email}
                </a>
              </div>
            )}
            {customer.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`tel:${customer.phone}`}
                  className="text-primary hover:underline"
                >
                  {customer.phone}
                </a>
              </div>
            )}
            {customer.address && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{customer.address}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <CustomerStats stats={stats} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RentalHistory rentals={rentalHistory} />
        </div>
        <div>
          <TopBooks books={topBooks} />
        </div>
      </div>
    </div>
  );
}

