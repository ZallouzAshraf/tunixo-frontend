"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { staggerContainer, fadeInLeft } from "@/lib/animations";
import { useCurrentUser, useLogout } from "@/hooks/useAuth";
import { useUiStore } from "@/store/uiStore";
import { useWalletBalance } from "@/hooks/useWallet";
import { useDashboardStats } from "@/hooks/useAdmin";
import { formatTND } from "@/lib/utils";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import type { User } from "@/types";

type NavItem =
  | { divider: true }
  | {
      icon: string;
      label: string;
      href: string;
      badge?: "pendingOrders" | "pendingDeposits" | "pendingWithdrawals";
    };

function getNavItems(
  role: User["role"],
  badgeCounts: { orders: number; deposits: number; withdrawals: number },
): NavItem[] {
  const BUYER: NavItem[] = [
    { icon: "🏠", label: "Tableau de bord", href: "/dashboard" },
    { icon: "🛒", label: "Services", href: "/services" },
    { icon: "📦", label: "Mes commandes", href: "/orders" },
    { icon: "👛", label: "Wallet", href: "/wallet" },
    { icon: "⚙️", label: "Paramètres", href: "/settings" },
  ];
  const SELLER: NavItem[] = [
    { icon: "🏠", label: "Tableau de bord", href: "/dashboard" },
    { icon: "🛒", label: "Services", href: "/services" },
    { icon: "📦", label: "Mes commandes", href: "/orders" },
    { icon: "👛", label: "Wallet", href: "/wallet" },
    { divider: true },
    { icon: "💵", label: "Espace vendeur", href: "/seller" },
    { icon: "💰", label: "Mes dépôts", href: "/seller/deposits" },
    { icon: "💸", label: "Mes retraits", href: "/seller/withdrawals" },
    { divider: true },
    { icon: "⚙️", label: "Paramètres", href: "/settings" },
  ];
  const ADMIN: NavItem[] = [
    { icon: "📊", label: "Dashboard", href: "/admin" },
    {
      icon: "📦",
      label: "Commandes",
      href: "/admin/orders",
      badge: "pendingOrders",
    },
    {
      icon: "💰",
      label: "Dépôts",
      href: "/admin/deposits",
      badge: "pendingDeposits",
    },
    {
      icon: "💸",
      label: "Retraits",
      href: "/admin/withdrawals",
      badge: "pendingWithdrawals",
    },
    { icon: "👥", label: "Utilisateurs", href: "/admin/users" },
    { icon: "🛒", label: "Services", href: "/admin/services" },
    { icon: "📦", label: "Stock", href: "/admin/accounts" },
    { divider: true },
    { icon: "🏠", label: "Vue client", href: "/dashboard" },
  ];

  if (role === "ADMIN") {
    return ADMIN.map((item) => {
      if ("badge" in item && item.badge) {
        const count =
          item.badge === "pendingOrders"
            ? badgeCounts.orders
            : item.badge === "pendingDeposits"
              ? badgeCounts.deposits
              : badgeCounts.withdrawals;
        return { ...item, badge: item.badge } as NavItem;
      }
      return item;
    });
  }
  if (role === "SELLER") return SELLER;
  return BUYER;
}

function isActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (href !== "/dashboard" && href !== "/admin" && pathname.startsWith(href))
    return true;
  return false;
}

export default function Sidebar() {
  const pathname = usePathname() ?? "";
  const { user } = useCurrentUser();
  const { logout } = useLogout();
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const { data: walletData } = useWalletBalance();
  const balance = walletData?.balance ?? 0;

  const role = user?.role ?? "BUYER";
  const { data: dashboardStats } = useDashboardStats(role === "ADMIN");
  const badgeCounts = {
    orders: dashboardStats?.orders?.pending ?? 0,
    deposits: dashboardStats?.deposits?.pending ?? 0,
    withdrawals: dashboardStats?.withdrawals?.pending ?? 0,
  };
  const navItems = getNavItems(role, badgeCounts);

  const handleLogoutClick = () => setLogoutConfirmOpen(true);

  const onConfirmLogout = () => {
    setLogoutConfirmOpen(false);
    logout();
  };

  const showWalletSection = role === "BUYER" || role === "SELLER";

  return (
    <>
      <ConfirmDialog
        isOpen={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        onConfirm={onConfirmLogout}
        title="Se déconnecter"
        description="Êtes-vous sûr de vouloir vous déconnecter ?"
        confirmText="Se déconnecter"
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          aria-hidden
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-[240px] flex-col border-r border-[#1e1e1e] bg-[#0d0d0d] font-sans transition-transform duration-200 md:static md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo + role badge */}
        <div className="flex items-center gap-2 border-b border-[#1e1e1e] px-4 py-5">
          <Link
            href={role === "ADMIN" ? "/admin" : "/dashboard"}
            className="flex shrink-0"
          >
            <Image
              src="/assets/logo.png"
              alt="Tunixo"
              width={120}
              height={32}
              priority
              className="h-8 w-auto"
            />
          </Link>
          {role === "ADMIN" && (
            <span className="rounded-full border border-red-500/30 bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400">
              Admin
            </span>
          )}
          {role === "SELLER" && (
            <span className="rounded-full border border-indigo-500/30 bg-indigo-500/20 px-2 py-0.5 text-xs font-medium text-indigo-400">
              Vendeur
            </span>
          )}
        </div>

        {/* Nav items */}
        <motion.nav
          className="flex flex-1 flex-col gap-0 overflow-y-auto p-2"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {navItems.map((item, idx) => {
            if ("divider" in item && item.divider) {
              return (
                <div
                  key={`div-${idx}`}
                  className="my-2 border-t border-white/5"
                />
              );
            }
            const { icon, label, href, badge } = item as Exclude<
              NavItem,
              { divider: true }
            >;
            const count =
              badge === "pendingOrders"
                ? badgeCounts.orders
                : badge === "pendingDeposits"
                  ? badgeCounts.deposits
                  : badge === "pendingWithdrawals"
                    ? badgeCounts.withdrawals
                    : 0;
            const active = isActive(pathname, href);
            return (
              <motion.div key={href} variants={fadeInLeft}>
                <Link
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "mx-2 flex items-center rounded-lg px-3 py-2 text-sm transition-all duration-150",
                    active
                      ? "border-l-2 border-indigo-500 bg-indigo-500/10 font-medium text-indigo-400"
                      : "border-l-2 border-transparent text-gray-400 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <span className="mr-3 text-base">{icon}</span>
                  <span className="flex-1">{label}</span>
                  {count > 0 && (
                    <span className="ml-auto rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white">
                      {count}
                    </span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>

        {/* Wallet balance (BUYER + SELLER only) */}
        {showWalletSection && (
          <div className="mx-3 mb-3 rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="mb-1 text-xs text-gray-400">Solde wallet</p>
            <p className="mb-2 font-bold text-white">
              {formatTND(balance)} TND
            </p>
            <Link
              href="/wallet"
              className="inline-block rounded-lg bg-indigo-500/20 px-3 py-1.5 text-sm font-medium text-indigo-400 transition-colors hover:bg-indigo-500/30"
            >
              Recharger
            </Link>
          </div>
        )}

        {/* User section */}
        <div className="mx-3 mb-3 rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-medium text-indigo-400">
              {(user?.fullName ?? user?.email ?? "U").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white">
                {user?.fullName ?? "Utilisateur"}
              </p>
              <p className="truncate text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogoutClick}
            className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
          >
            <span>→</span>
            Se déconnecter
          </button>
        </div>
      </aside>
    </>
  );
}
