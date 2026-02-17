import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReceivedConvertedUser } from "../types/ConvertedUser.ts";

type AuthContextShape = {
  user: ReceivedConvertedUser | null;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<ReceivedConvertedUser | null>>;
};

export const AuthContext = createContext<AuthContextShape | undefined>(
  undefined,
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = (
  { children },
) => {
  const refreshUser = () => {
    return fetch(`${import.meta.env.VITE_APIURL}/user`, {
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
  const [user, setUser] = useState<ReceivedConvertedUser | null>(null);

  useEffect(() => {
    refreshUser();
  }, []);

  const login = () => {
    refreshUser();
  };
  const logout = () => {
    setUser(null);
    // optional: call backend logout endpoint to clear session cookie
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
