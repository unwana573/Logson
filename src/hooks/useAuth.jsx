import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
import { getToken, setToken } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, if a token is stored from a previous session, fetch the
  // current user so a page refresh doesn't drop them back to signed-out.
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .me()
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const signup = async ({ fullName, email, password }) => {
    const data = await authService.signup({ fullName, email, password });
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const login = async ({ email, password }) => {
    const data = await authService.login({ email, password });
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const googleAuth = async (idToken) => {
    const data = await authService.googleAuth(idToken);
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const signOut = () => {
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    const data = await authService.me();
    setUser(data);
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, googleAuth, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
