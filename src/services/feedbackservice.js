import { api } from "./api";

export const feedbackService = {
  submit: (message) => api.post("/feedback", { message }),
  listAll: () => api.get("/feedback"),
};