"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const t = useTranslations("auth");
  const tc = useTranslations("common");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"FREELANCER" | "EMPLOYER">("FREELANCER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      const locale = window.location.pathname.split("/")[1] || "en";
      const target = data.role === "EMPLOYER"
        ? `/${locale}/employer/dashboard`
        : `/${locale}/freelancer/dashboard`;
      window.location.href = target;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="text-3xl font-bold text-brand-600 mb-2">{tc("appName")}</div>
        <CardTitle>{t("loginTitle")}</CardTitle>
        <CardDescription>{tc("tagline")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              id="password"
              type="password"
              placeholder="admin123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Login as</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("FREELANCER")}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                  role === "FREELANCER"
                    ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                    : "border-border hover:border-brand-300 text-muted-foreground"
                }`}
              >
                Freelancer
              </button>
              <button
                type="button"
                onClick={() => setRole("EMPLOYER")}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                  role === "EMPLOYER"
                    ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                    : "border-border hover:border-brand-300 text-muted-foreground"
                }`}
              >
                Employer
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? tc("loading") : tc("login")}
          </Button>

          <div className="text-center text-xs text-muted-foreground pt-2">
            Demo credentials: <span className="font-mono font-medium text-foreground">admin</span> / <span className="font-mono font-medium text-foreground">admin123</span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
