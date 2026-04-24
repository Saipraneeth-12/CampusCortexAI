import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { useRole, ROLES, ROLE_META } from "@/context/RoleContext";

export function RoleSelector() {
  const { role, setRole } = useRole();
  const [open, setOpen] = useState(false);
  const meta = ROLE_META[role];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="glass flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2 text-xs font-semibold transition-colors hover:bg-white/10"
      >
        <span>{meta.icon}</span>
        <span className="hidden sm:inline" style={{ color: meta.color }}>{role}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="glass-strong absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-border/60 p-1.5 shadow-[0_20px_60px_oklch(0.05_0.02_265/0.8)]"
            >
              <p className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                Switch Role
              </p>
              {ROLES.map((r) => {
                const m = ROLE_META[r];
                const active = r === role;
                return (
                  <button
                    key={r}
                    onClick={() => { setRole(r); setOpen(false); }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${active ? "bg-white/10" : "hover:bg-white/5"}`}
                  >
                    <span className="text-base">{m.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold" style={{ color: active ? m.color : undefined }}>{r}</div>
                      <div className="truncate text-[10px] text-muted-foreground">{m.focus.split(",")[0]}</div>
                    </div>
                    {active && <Check className="h-3.5 w-3.5 shrink-0" style={{ color: m.color }} />}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
