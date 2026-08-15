import { api } from "./api";

export const productService = {
  /**
   * Powers the dashboard search bar + category filter.
   * `search` matches product name or vendor, case-insensitively, on the backend.
   */
  list: ({ search, categoryId } = {}) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categoryId) params.set("category_id", categoryId);
    const qs = params.toString();
    return api.get(`/products${qs ? `?${qs}` : ""}`, { auth: false });
  },

  get: (id) => api.get(`/products/${id}`, { auth: false }),

  create: ({ name, vendor, categoryId, priceKobo, imageUrl, stockText }) =>
    api.post("/products", {
      name,
      vendor,
      category_id: categoryId,
      price_kobo: priceKobo,
      image_url: imageUrl,
      stock_text: stockText,
    }),

  update: (id, payload) => api.patch(`/products/${id}`, payload),

  addStock: (id, stockText) => api.post(`/products/${id}/stock`, { stock_text: stockText }),
};
