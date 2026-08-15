import { api } from "./api";

export const authService = {
  signup: ({ fullName, email, password }) =>
    api.post(
      "/auth/signup",
      { full_name: fullName, email, password },
      { auth: false }
    ),

  login: ({ email, password }) =>
    api.post("/auth/login", { email, password }, { auth: false }),

  googleAuth: (idToken) =>
    api.post("/auth/google", { id_token: idToken }, { auth: false }),

  me: () => api.get("/auth/me"),
};
