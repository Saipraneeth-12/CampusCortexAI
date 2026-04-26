import { createFileRoute } from "@tanstack/react-router";
import { InlineChatbot } from "@/components/AIChatbot";
import { useRole, ROLE_META } from "@/context/RoleContext";
import { Bot, Sparkles } from "lucide-react";

export const Route = createFileRoute("/dashboard/chatbot")({
  head: () => ({ meta: [{ title: "AI Chatbot — Campus Cortex AI" }] }),
  component: ChatbotPage,
});

function ChatbotPage() {
  const { role } = useRole();
  const meta = ROLE_META[role];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em]" style={{ color: meta.color }}>
            {meta.icon} {role} · AI Assistant
          </p>
          <h1 className="font-display text-3xl font-bold md:text-4xl">AI Chatbot</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ask anything about today's market intelligence, competitors, and trends.
          </p>
        </div>
        <div className="flex items-center gap-2 glass rounded-xl px-3 py-2 text-xs">
          <Bot className="h-3.5 w-3.5 text-[oklch(0.85_0.18_200)]" />
          <span>Powered by Groq</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <Sparkles className="h-3.5 w-3.5 text-[oklch(0.7_0.24_255)]" />
          <span>Live context</span>
        </div>
      </header>

      <InlineChatbot />
    </div>
  );
}
