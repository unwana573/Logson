import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
import { getAccessToken, setTokens, clearTokens } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, if a token is stored from a previous session, fetch the
  // current user so a page refresh doesn't drop them back to signed-out.
  // If the access token has expired but the refresh token hasn't, this
  // still works -- api.js transparently refreshes on the 401 from /auth/me
  // before this .catch ever sees a failure.
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .me()
      .then(setUser)
      .catch(() => clearTokens())
      .finally(() => setLoading(false));
  }, []);

  const signup = async ({ fullName, email, password }) => {
    const data = await authService.signup({ fullName, email, password });
    setTokens(data);
    setUser(data.user);
    return data.user;
  };

  const login = async ({ email, password }) => {
    const data = await authService.login({ email, password });
    setTokens(data);
    setUser(data.user);
    return data.user;
  };

  const googleAuth = async (idToken) => {
    const data = await authService.googleAuth(idToken);
    setTokens(data);
    setUser(data.user);
    return data.user;
  };

  const signOut = () => {
    clearTokens();
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