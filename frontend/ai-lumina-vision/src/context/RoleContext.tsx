import { createContext, useContext, type ReactNode } from "react";

export type Role = "Institute Owner";

export const ROLES: Role[] = ["Institute Owner"];

export const ROLE_META: Record<Role, { icon: string; color: string; focus: string; initials: string }> = {
  "Institute Owner": {
    icon: "🏫",
    color: "oklch(0.7 0.24 255)",
    focus: "LMS adoption, student enrollment tech, competitor institutes, school management software",
    initials: "IO",
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
  return (
    <RoleContext.Provider value={{ role: "Institute Owner", setRole: () => {} }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
