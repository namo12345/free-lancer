"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DEMO_ACCOUNTS = [
  {
    username: "freelancer",
    password: "freelancer123",
    role: "Freelancer",
    name: "Arjun Sharma",
    desc: "Full-Stack Developer · React & Node.js",
    icon: "👨‍💻",
  },
  {
    username: "employer",
    password: "employer123",
    role: "Employer",
    name: "TechVenture Solutions",
    desc: "Priya Menon · Mumbai",
    icon: "🏢",
  },
];

export default function LoginPage() {
  const t = useTranslations("auth");
  const tc = useTranslations("common");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    await doLogin(username, password);
  }

  async function doLogin(u: string, p: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, password: p }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }
      const locale = window.location.pathname.split("/")[1] || "en";
      window.location.href = data.role === "EMPLOYER"
        ? `/${locale}/employer/dashboard`
        : `/${locale}/freelancer/dashboard`;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  function quickLogin(account: typeof DEMO_ACCOUNTS[0]) {
    setUsername(account.username);
    setPassword(account.password);
    doLogin(account.username, account.password);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="text-3xl font-bold text-brand-600 mb-2">{tc("appName")}</div>
        <CardTitle>{t("loginTitle")}</CardTitle>
        <CardDescription>{tc("tagline")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Quick login cards */}
        <div>
          <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Quick Demo Login</p>
          <div className="grid grid-cols-2 gap-3">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.username}
                type="button"
                onClick={() => quickLogin(account)}
                disabled={loading}
                className="p-3 rounded-lg border-2 border-border hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950 text-left transition-colors disabled:opacity-50"
              >
                <div className="text-xl mb-1">{account.icon}</div>
                <div className="text-sm font-semibold">{account.role}</div>
                <div className="text-xs text-muted-foreground leading-tight">{account.name}</div>
                <div className="text-xs text-muted-foreground/70 leading-tight mt-0.5">{account.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">or enter manually</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="freelancer or employer"
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
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? tc("loading") : tc("login")}
          </Button>
        </form>

        <div className="text-center text-xs text-muted-foreground space-y-1 pt-1">
          <div><span className="font-mono font-medium text-foreground">freelancer</span> / <span className="font-mono font-medium text-foreground">freelancer123</span></div>
          <div><span className="font-mono font-medium text-foreground">employer</span> / <span className="font-mono font-medium text-foreground">employer123</span></div>
        </div>
      </CardContent>
    </Card>
  );
}
