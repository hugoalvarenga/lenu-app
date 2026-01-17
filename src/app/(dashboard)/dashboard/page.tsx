import Link from "next/link";
import { format, parseISO, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  BookCopy,
  Users,
  BookOpen,
  AlertTriangle,
  ArrowRight,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Badge, Button } from "@/shared/components/ui";
import { cn } from "@/shared/lib/utils";
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

  const stats = [
    {
      title: "Total de Livros",
      value: booksStats.total,
      subtitle: `${booksStats.available} disponíveis`,
      icon: BookCopy,
      trend: booksStats.available > 0 ? "positive" : "neutral",
    },
    {
      title: "Clientes",
      value: customersCount,
      icon: Users,
      trend: "neutral" as const,
    },
    {
      title: "Aluguéis Ativos",
      value: rentalsStats.active,
      subtitle: `${rentalsStats.total} no total`,
      icon: Clock,
      trend: "neutral" as const,
    },
    {
      title: "Em Atraso",
      value: rentalsStats.overdue,
      icon: AlertTriangle,
      trend: rentalsStats.overdue > 0 ? ("negative" as const) : ("positive" as const),
      highlight: rentalsStats.overdue > 0,
    },
  ];

  const quickLinks = [
    {
      href: "/books",
      icon: BookCopy,
      title: "Livros",
      description: "Gerencie seu catálogo",
      stat: `${booksStats.total} cadastrados`,
    },
    {
      href: "/customers",
      icon: Users,
      title: "Clientes",
      description: "Cadastre seus clientes",
      stat: `${customersCount} ativos`,
    },
    {
      href: "/rentals",
      icon: BookOpen,
      title: "Aluguéis",
      description: "Controle os aluguéis",
      stat: `${rentalsStats.active} em andamento`,
    },
    {
      href: "/calendar",
      icon: Calendar,
      title: "Calendário",
      description: "Visualize as datas",
      stat: "Ver agenda",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do seu sistema de livros
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={cn(
              "group relative overflow-hidden rounded-xl border border-border/50 bg-card p-5 transition-all hover:border-border",
              stat.highlight && "border-red-500/30 bg-red-500/5"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p
                  className={cn(
                    "text-3xl font-semibold tracking-tight tabular-nums",
                    stat.highlight && "text-red-600 dark:text-red-500"
                  )}
                >
                  {stat.value}
                </p>
                {stat.subtitle && (
                  <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                )}
              </div>
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  stat.highlight
                    ? "bg-red-500/10"
                    : "bg-primary/10"
                )}
              >
                <stat.icon
                  className={cn(
                    "h-5 w-5",
                    stat.highlight
                      ? "text-red-600 dark:text-red-500"
                      : "text-primary"
                  )}
                />
              </div>
            </div>
            <div
              className={cn(
                "absolute bottom-0 left-0 h-1 w-full",
                stat.highlight
                  ? "bg-gradient-to-r from-red-500/30 via-red-500/10 to-transparent"
                  : "bg-gradient-to-r from-primary/20 via-primary/10 to-transparent"
              )}
            />
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-border/50 bg-card">
            <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
              <div>
                <h3 className="font-semibold">Livros em Atraso</h3>
                <p className="text-sm text-muted-foreground">
                  Livros que passaram da data de devolução
                </p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/rentals" className="gap-2">
                  Ver todos
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {overdueRentals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle className="h-7 w-7 text-emerald-600" />
                </div>
                <p className="font-medium">Nenhum livro em atraso</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Todos os livros foram devolvidos no prazo
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {overdueRentals.slice(0, 5).map((rental) => {
                  const daysOverdue = differenceInDays(
                    new Date(),
                    parseISO(rental.expected_return_date)
                  );

                  return (
                    <div
                      key={rental.id}
                      className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/30"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">
                          {rental.book.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {rental.customer.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant="secondary"
                          className="border-0 bg-red-500/10 text-red-600 dark:text-red-500"
                        >
                          {daysOverdue} {daysOverdue === 1 ? "dia" : "dias"}
                        </Badge>
                        <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                          Previsto:{" "}
                          {format(parseISO(rental.expected_return_date), "dd/MM", {
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border/50 bg-card">
            <div className="border-b border-border/50 px-6 py-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Acesso Rápido</h3>
              </div>
            </div>

            <div className="p-4 space-y-2">
              {quickLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <div className="group flex items-center gap-4 rounded-lg p-3 transition-all hover:bg-muted/50">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                      <link.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{link.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {link.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {link.stat}
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
