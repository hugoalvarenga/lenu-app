import Link from "next/link";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  BookCopy,
  Users,
  BookOpen,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button,
} from "@/shared/components/ui";
import { cn } from "@/shared/lib/utils";
import { StatsCard } from "@/shared/components/dashboard";
import { getBooksCount } from "@/features/books";
import { getCustomersCount } from "@/features/customers";
import { getRentalsCount, getOverdueRentals } from "@/features/rentals";

export default async function DashboardPage() {
  const [booksStats, customersCount, rentalsStats, overdueRentals] =
    await Promise.all([
      getBooksCount(),
      getCustomersCount(),
      getRentalsCount(),
      getOverdueRentals(),
    ]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do seu sistema de livros
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Livros"
          value={booksStats.total}
          icon={BookCopy}
          description={`${booksStats.available} disponíveis`}
        />
        <StatsCard
          title="Clientes"
          value={customersCount}
          icon={Users}
        />
        <StatsCard
          title="Aluguéis Ativos"
          value={rentalsStats.active}
          icon={BookOpen}
          description={`${rentalsStats.total} no total`}
        />
        <StatsCard
          title="Em Atraso"
          value={rentalsStats.overdue}
          icon={AlertTriangle}
          className={cn(
            rentalsStats.overdue > 0 &&
              "border-red-500/20 bg-red-500/5"
          )}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Livros em Atraso</CardTitle>
              <CardDescription>
                Livros que passaram da data de devolução
              </CardDescription>
            </div>
            <Link href="/rentals">
              <Button variant="ghost" size="sm">
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {overdueRentals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-4 rounded-full bg-emerald-500/10 p-3">
                  <BookOpen className="h-6 w-6 text-emerald-600" />
                </div>
                <p className="font-medium">Nenhum livro em atraso</p>
                <p className="text-sm text-muted-foreground">
                  Todos os livros foram devolvidos no prazo
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {overdueRentals.slice(0, 5).map((rental) => (
                  <div
                    key={rental.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {rental.book.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {rental.customer.name}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="ml-4 border-red-500/20 bg-red-500/10 text-red-600"
                    >
                      {format(parseISO(rental.expected_return_date), "dd/MM", {
                        locale: ptBR,
                      })}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Acesso Rápido</CardTitle>
            <CardDescription>Navegue para as seções principais</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Link href="/books">
              <div className="flex items-center gap-4 rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/50">
                <div className="rounded-md bg-primary/10 p-2">
                  <BookCopy className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Livros</p>
                  <p className="text-sm text-muted-foreground">
                    Gerencie seu catálogo
                  </p>
                </div>
              </div>
            </Link>
            <Link href="/customers">
              <div className="flex items-center gap-4 rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/50">
                <div className="rounded-md bg-primary/10 p-2">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Clientes</p>
                  <p className="text-sm text-muted-foreground">
                    Cadastre seus clientes
                  </p>
                </div>
              </div>
            </Link>
            <Link href="/rentals">
              <div className="flex items-center gap-4 rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/50">
                <div className="rounded-md bg-primary/10 p-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Aluguéis</p>
                  <p className="text-sm text-muted-foreground">
                    Controle os aluguéis
                  </p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
