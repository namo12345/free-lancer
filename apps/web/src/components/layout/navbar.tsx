"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { NotificationBell } from "@/components/layout/notification-bell";

interface NavbarProps {
  user?: {
    email: string;
    displayName?: string;
    avatarUrl?: string;
    role?: "FREELANCER" | "EMPLOYER" | "ADMIN" | null;
  } | null;
  notifications?: {
    id: string;
    type: string;
    title: string;
    body: string;
    isRead: boolean;
    createdAt: string;
  }[];
}

export function Navbar({ user, notifications = [] }: NavbarProps) {
  const t = useTranslations("common");

  const dashboardHref =
    user?.role === "EMPLOYER"
      ? "/employer/dashboard"
      : user?.role === "ADMIN"
        ? "/admin"
        : "/freelancer/dashboard";

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-bold text-brand-600">
              {t("appName")}
            </Link>
            <Link href="/gigs" className="text-sm font-medium text-muted-foreground hover:text-brand-600 hidden sm:block">
              {t("search")}
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            {user ? (
              <>
                <Link href={dashboardHref}>
                  <Button variant="ghost" size="sm">{t("dashboard")}</Button>
                </Link>
                <NotificationBell initialNotifications={notifications} />
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
