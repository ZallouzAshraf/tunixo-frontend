"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDashboardStats } from "@/hooks/useAdmin";
import {
  LayoutDashboard,
  Users,
  Package,
  CreditCard,
  ShoppingBag,
  ArrowDownCircle,
  ArrowUpCircle,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import * as auth from "@/lib/auth";
import { useAuthStore } from "@/store/authStore";

const items: Array<{
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: "orders" | "deposits" | "withdrawals";
}> = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "/admin/orders",
    label: "Commandes",
    icon: ShoppingBag,
    badge: "orders",
  },
  {
    href: "/admin/deposits",
    label: "Dépôts",
    icon: ArrowDownCircle,
    badge: "deposits",
  },
  {
    href: "/admin/withdrawals",
    label: "Retraits",
    icon: ArrowUpCircle,
    badge: "withdrawals",
  },
  { href: "/admin/users", label: "Utilisateurs", icon: Users },
  { href: "/admin/services", label: "Services", icon: Package },
  { href: "/admin/accounts", label: "Stock", icon: CreditCard },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: stats } = useDashboardStats();
  const pendingOrders = stats?.orders?.pending ?? 0;
  const pendingDeposits = stats?.deposits?.pending ?? 0;
  const pendingWithdrawals = stats?.withdrawals?.pending ?? 0;

  const getBadge = (badge: string) => {
    if (badge === "orders") return pendingOrders;
    if (badge === "deposits") return pendingDeposits;
    if (badge === "withdrawals") return pendingWithdrawals;
    return 0;
  };

  const handleLogout = () => {
    auth.clearTokens();
    useAuthStore.getState().clearAuth();
    window.location.href = "/login";
  };

  return (
    <aside className="flex w-[260px] shrink-0 flex-col border-r border-[#1e1e1e] bg-[#111111]">
      <div className="flex h-16 items-center gap-2 border-b border-[#1e1e1e] px-4">
        <Link href="/admin" className="flex shrink-0">
          <Image
            src="/assets/logo.png"
            alt="Tunixo"
            width={120}
            height={32}
            priority
            className="h-8 w-auto"
          />
        </Link>
        <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400">
          Admin
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {items.map(({ href, label, icon: Icon, badge }) => {
          const count = badge ? getBadge(badge) : 0;
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-[#6366f1] text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white",
              )}
            >
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {label}
              </span>
              {count > 0 && (
                <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400">
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-[#1e1e1e] p-4">
        <Link
          href="/dashboard"
          className="mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" />
          Vue client →
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
