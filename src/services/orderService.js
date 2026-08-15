import { api } from "./api";

export const orderService = {
  create: ({ productId, quantity, paymentMethod, proofUrl }) =>
    api.post("/orders", {
      product_id: productId,
      quantity,
      payment_method: paymentMethod, // "manual" | "paystack"
      proof_url: proofUrl,
    }),

  myOrders: () => api.get("/orders/me"),

  // Admin: view all orders/payments, optionally filtered by status
  listAll: (status) => api.get(`/orders${status ? `?status=${status}` : ""}`),

  approve: (orderId) => api.post(`/orders/${orderId}/approve`),
  reject: (orderId) => api.post(`/orders/${orderId}/reject`),

  paystackInit: (orderId) => api.post(`/orders/${orderId}/paystack/init`),
  paystackVerify: (orderId) => api.post(`/orders/${orderId}/paystack/verify`),
};

export const userService = {
  list: () => api.get("/users"),
  updateRole: (userId, isAdmin) => api.patch(`/users/${userId}/role`, { is_admin: isAdmin }),
  updateStatus: (userId, isActive) => api.patch(`/users/${userId}/status`, { is_active: isActive }),
  myCredentials: () => api.get("/users/me/credentials"),
};
