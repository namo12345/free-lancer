"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const tc = useTranslations("common");

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="text-3xl font-bold text-brand-600 mb-2">{tc("appName")}</div>
        <CardTitle>Get Started</CardTitle>
        <CardDescription>
          Use the demo login to explore the platform.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-muted/50 p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">Demo Credentials</p>
          <p className="font-mono text-sm font-medium">
            Username: <span className="text-brand-600">admin</span>
          </p>
          <p className="font-mono text-sm font-medium">
            Password: <span className="text-brand-600">admin123</span>
          </p>
        </div>
        <Link href="/login" className="block">
          <Button className="w-full">Go to Login</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
