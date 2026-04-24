import { createContext, useContext, useState, type ReactNode } from "react";

export type Role =
  | "Institute Owner"
  | "Backend Developer"
  | "Data Engineer"
  | "Founder / Entrepreneur"
  | "Product Builder";

export const ROLES: Role[] = [
  "Institute Owner",
  "Backend Developer",
  "Data Engineer",
  "Founder / Entrepreneur",
  "Product Builder",
];

export const ROLE_META: Record<Role, { icon: string; color: string; focus: string; initials: string }> = {
  "Institute Owner": {
    icon: "🏫",
    color: "oklch(0.7 0.24 255)",
    focus: "LMS adoption, student enrollment tech, competitor institutes, school management software",
    initials: "IO",
  },
  "Backend Developer": {
    icon: "⚙️",
    color: "oklch(0.85 0.18 200)",
    focus: "Framework trends, API tools, cloud infrastructure, stack demand signals",
    initials: "BD",
  },
  "Data Engineer": {
    icon: "📊",
    color: "oklch(0.78 0.2 155)",
    focus: "Pipeline tools, ETL trends, real-time analytics, AI data infrastructure",
    initials: "DE",
  },
  "Founder / Entrepreneur": {
    icon: "🚀",
    color: "oklch(0.82 0.17 75)",
    focus: "Startup funding, market gaps, competitor acquisitions, SaaS growth signals",
    initials: "FE",
  },
  "Product Builder": {
    icon: "🛠️",
    color: "oklch(0.65 0.28 300)",
    focus: "Product launches, UX trends, no-code tools, competitor feature releases",
    initials: "PB",
  },
};

interface RoleContextValue {
  role: Role;
  setRole: (r: Role) => void;
}

const RoleContext = createContext<RoleContextValue>({
  role: "Institute Owner",
  setRole: () => {},
});

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(() => {
    if (typeof window === "undefined") return "Institute Owner";
    const saved = localStorage.getItem("campus-cortex-role");
    return (saved as Role) || "Institute Owner";
  });

  const handleSetRole = (r: Role) => {
    setRole(r);
    if (typeof window !== "undefined") {
      localStorage.setItem("campus-cortex-role", r);
    }
  };

  return (
    <RoleContext.Provider value={{ role, setRole: handleSetRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
