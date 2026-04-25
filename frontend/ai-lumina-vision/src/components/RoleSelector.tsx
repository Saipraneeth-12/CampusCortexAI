import { ROLE_META } from "@/context/RoleContext";

export function RoleSelector() {
  const meta = ROLE_META["Institute Owner"];

  return (
    <div className="glass flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2 text-xs font-semibold">
      <span>{meta.icon}</span>
      <span className="hidden sm:inline" style={{ color: meta.color }}>Institute Owner</span>
    </div>
  );
}
