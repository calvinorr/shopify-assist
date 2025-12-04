import { Sidebar } from "@/components/layout/sidebar";
import { ToastProvider } from "@/components/ui/toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
        <Sidebar />
        <main className="pl-64">{children}</main>
      </div>
    </ToastProvider>
  );
}
