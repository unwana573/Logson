import { api } from "./api";

export const categoryService = {
  list: () => api.get("/categories", { auth: false }),
  create: (name) => api.post("/categories", { name }),
  remove: (id) => api.delete(`/categories/${id}`),
};
