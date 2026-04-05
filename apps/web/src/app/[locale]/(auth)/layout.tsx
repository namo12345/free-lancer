export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-background to-blue-50 dark:from-brand-950/30 dark:via-background dark:to-blue-950/20 px-4">
      {children}
    </div>
  );
}
