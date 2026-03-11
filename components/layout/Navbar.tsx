"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Bell, LogOut } from "lucide-react";
import { useUiStore } from "@/store/uiStore";
import { useCurrentUser, useLogout } from "@/hooks/useAuth";
import { useWalletBalance } from "@/hooks/useWallet";
import { usePageTitle } from "@/hooks/usePageTitle";
import { formatTND } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useState } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function Navbar() {
  const router = useRouter();
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const { user } = useCurrentUser();
  const { logout } = useLogout();
  const title = usePageTitle();
  const { data: walletData, isLoading: walletLoading } = useWalletBalance();
  const balance = walletData?.balance ?? 0;
  const role = user?.role ?? "BUYER";
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const handleLogoutConfirm = () => {
    setLogoutConfirmOpen(false);
    logout();
  };

  return (
    <>
      <ConfirmDialog
        isOpen={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        onConfirm={handleLogoutConfirm}
        title="Se déconnecter"
        description="Êtes-vous sûr de vouloir vous déconnecter ?"
        confirmText="Se déconnecter"
      />

      <nav className="flex h-16 items-center justify-between border-b border-white/5 bg-[#0d0d0d] px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => toggleSidebar()}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/dashboard" className="lg:hidden flex shrink-0">
            <Image
              src="/assets/logo.png"
              alt="Tunixo"
              width={100}
              height={28}
              className="h-7 w-auto"
              priority
            />
          </Link>
          <h1 className="hidden lg:block text-lg font-semibold text-white">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {role !== "ADMIN" && (
            <>
              {walletLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Link
                  href="/wallet"
                  className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-400 transition-colors hover:bg-indigo-500/20"
                >
                  💳 {formatTND(balance)} TND
                </Link>
              )}
            </>
          )}
          {role === "ADMIN" && (
            <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400">
              Admin Panel
            </span>
          )}

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full outline-none ring-0 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0d0d0d]">
              <Avatar className="h-8 w-8 border border-white/10">
                <AvatarFallback className="bg-indigo-500/20 text-sm text-indigo-400">
                  {(user?.fullName ?? user?.email ?? "U")
                    .charAt(0)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 border-[#1e1e1e] bg-[#111111]"
            >
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => router.push("/settings")}
              >
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-red-400 focus:text-red-400"
                onSelect={() => setLogoutConfirmOpen(true)}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </>
  );
}
