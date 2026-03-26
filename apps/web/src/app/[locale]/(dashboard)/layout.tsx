import { Navbar } from "@/components/layout/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In production, fetch user from Supabase session
  const mockUser = { email: "user@example.com", displayName: "Demo User" };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={mockUser} />
      <div className="flex">
        {children}
      </div>
    </div>
  );
}
