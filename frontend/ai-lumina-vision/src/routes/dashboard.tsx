import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DataProvider } from "@/context/DataContext";
import { useRole } from "@/context/RoleContext";

function DashboardWithData() {
  const { role } = useRole();
  return (
    <DataProvider role={role}>
      <DashboardLayout />
    </DataProvider>
  );
}

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — CortexAI Growth OS" },
      { name: "description", content: "Your AI strategic growth copilot for EdTech." },
    ],
  }),
  component: DashboardWithData,
});
