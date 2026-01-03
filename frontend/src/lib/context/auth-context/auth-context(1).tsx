
import type { UserType } from "@/lib/types";
import { createContext, useContext } from "react";

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  user: UserType | null | undefined;
  setUser: (user: UserType | null) => void;
  isAuthLoading: boolean

};

// 👇 Create context
export const AuthContext = createContext<AuthContextType | null>(null);

// 👇 Custom hook (safe to export here)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};