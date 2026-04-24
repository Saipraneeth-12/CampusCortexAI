import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — CortexAI Growth OS" },
      { name: "description", content: "Your AI strategic growth copilot for EdTech." },
    ],
  }),
  component: DashboardLayout,
});
