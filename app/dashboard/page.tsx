import { Header } from "@/components/layout/header";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default function DashboardPage() {
  return (
    <>
      <Header
        title="Dashboard"
        description="Overview of your products and content"
      />
      <DashboardContent />
    </>
  );
}
