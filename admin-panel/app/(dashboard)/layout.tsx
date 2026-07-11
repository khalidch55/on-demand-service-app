import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import AuthGuard from "@/components/auth/AuthGuard";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <div className="min-h-full flex flex-col font-sans">
        <Sidebar />
        <div className="md:pl-64 flex flex-col flex-1 min-h-screen transition-all duration-300 ease-in-out">
          <Header />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
