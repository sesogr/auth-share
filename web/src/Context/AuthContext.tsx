import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReceivingConvertedUser } from "../types/types.ts";

type AuthContextShape = {
  user: ReceivingConvertedUser | null;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<ReceivingConvertedUser | null>>;
};

export const AuthContext = createContext<AuthContextShape | undefined>(
  undefined,
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = (
  { children },
) => {
  const refreshUser = () => {
    return fetch(`${import.meta.env.VITE_APIURL}/user/me`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => null);
  };
  const [user, setUser] = useState<ReceivingConvertedUser | null>(null);

  useEffect(() => {
    refreshUser();
  }, []);

  const login = () => {
    refreshUser();
  };
  const logout = () => {
    setUser(null);
    fetch(`${import.meta.env.VITE_APIURL}/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => {});
  };

  const value = useMemo(
    () => ({ user, login, logout, isAuthenticated: !!user, setUser }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
