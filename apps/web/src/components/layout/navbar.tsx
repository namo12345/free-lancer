"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

interface NavbarProps {
  user?: { email: string; displayName?: string; avatarUrl?: string } | null;
}

export function Navbar({ user }: NavbarProps) {
  const t = useTranslations("common");

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-bold text-brand-600">
              {t("appName")}
            </Link>
            <Link href="/gigs" className="text-sm font-medium text-gray-700 hover:text-brand-600 hidden sm:block">
              {t("search")}
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">{t("dashboard")}</Button>
                </Link>
                <Avatar
                  src={user.avatarUrl}
                  fallback={user.displayName || user.email}
                  size="sm"
                />
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">{t("login")}</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">{t("signup")}</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
