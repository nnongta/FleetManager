import { createContext, useContext, useState } from "react";

export type Role = "ADMIN" | "APPROVER" | "USER" | "DRIVER";

export interface AuthUser {
  id: number;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (email: string, password: string) => {
    // 🔴 mock user (แทน backend)
    if (email === "admin@test.com") {
      setUser({ id: 1, email, role: "ADMIN" });
    } else if (email === "approver@test.com") {
      setUser({ id: 2, email, role: "APPROVER" });
    } else {
      setUser({ id: 3, email, role: "USER" });
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
