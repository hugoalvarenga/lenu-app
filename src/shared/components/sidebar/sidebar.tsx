"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Users,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  BookCopy,
  Menu,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui";
import { logoutAction } from "@/features/auth/server-actions";
import { useState } from "react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Livros",
    href: "/books",
    icon: BookCopy,
  },
  {
    label: "Clientes",
    href: "/customers",
    icon: Users,
  },
  {
    label: "Aluguéis",
    href: "/rentals",
    icon: BookOpen,
  },
  {
    label: "Calendário",
    href: "/calendar",
    icon: CalendarDays,
  },
];

interface SidebarProps {
  userName?: string | null;
}

function SidebarContent({
  userName,
  onNavigate,
}: SidebarProps & { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/50 p-4">
        {userName && (
          <p className="mb-3 truncate text-sm text-muted-foreground">
            {userName}
          </p>
        )}
        <form action={logoutAction}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </form>
      </div>
    </div>
  );
}

export function Sidebar({ userName }: SidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center gap-4 border-b border-border/50 bg-background px-4 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="-ml-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="flex h-14 items-center gap-2 border-b border-border/50 px-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                  <BookOpen className="h-4 w-4 text-primary-foreground" />
                </div>
                <SheetTitle className="text-lg font-semibold tracking-tight">
                  Lenu
                </SheetTitle>
              </div>
            </SheetHeader>
            <SidebarContent userName={userName} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <BookOpen className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Lenu</span>
        </div>
      </header>

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-border/50 bg-background md:block">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center gap-2 border-b border-border/50 px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <BookOpen className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Lenu</span>
          </div>
          <SidebarContent userName={userName} />
        </div>
      </aside>
    </>
  );
}
