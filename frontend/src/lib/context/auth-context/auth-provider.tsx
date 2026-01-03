"use client";
import React, { useEffect, useState } from "react";
import { config } from "@/lib/config";
import type { UserType } from "@/lib/types";
import { AuthContext } from "./auth-context";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null | undefined>(undefined); // 👈 undefined = not loaded yet
  const [user, setUser] = useState<UserType | null | undefined>(undefined);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const saveToken = (token: string | null) => {
    if (typeof window !== "undefined") {
      if (token) localStorage.setItem("token-menulink-xyz", token);
      else localStorage.removeItem("token-menulink-xyz");
    }
    setToken(token);
  };

  // Load token once (on mount)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token-menulink-xyz");
      setToken(storedToken); // this will trigger user fetch
    }
  }, []);

  // Fetch user when token is available (including null)
  useEffect(() => {
    // 👇 Skip running until token is actually loaded from storage
    if (token === undefined) return;

    const getUser = async () => {
      if (!token) {
        // No token = not logged in
        setUser(null);
        setIsAuthLoading(false);
        return;
      }

      try {
        setIsAuthLoading(true);
        const res = await fetch(`${config.backend_url}/api/auth/user`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          console.log("USER", data);
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    getUser();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token: token ?? null,
        setToken: saveToken,
        user,
        setUser,
        isAuthLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
