import { api } from "./api";

export const orderService = {
  create: ({ productId, quantity, paymentMethod }) =>
    api.post("/orders", {
      product_id: productId,
      quantity,
      payment_method: paymentMethod, // "manual" | "paga"
    }),

  // Manual transfer proof-of-payment image. Sent as multipart/form-data;
  // the field name "file" matches the backend's UploadFile parameter.
  uploadProof: (orderId, file) => {
    const form = new FormData();
    form.append("file", file);
    return api.post(`/orders/${orderId}/proof`, form);
  },

  // The proof endpoint is bearer-protected, so it can't be loaded via a plain
  // <img src>; fetch the bytes as a Blob and let the caller make an object URL.
  getProof: (orderId) => api.getBlob(`/orders/${orderId}/proof`),

  myOrders: () => api.get("/orders/me"),

  // Remove one of your own orders you've changed your mind about. The
  // backend only allows this for orders that haven't been fulfilled yet
  // (see OrderService.delete_order).
  remove: (orderId) => api.delete(`/orders/${orderId}`),

  // Admin: view all orders/payments, optionally filtered by status
  listAll: (status) => api.get(`/orders${status ? `?status=${status}` : ""}`),

  approve: (orderId) => api.post(`/orders/${orderId}/approve`),
  reject: (orderId) => api.post(`/orders/${orderId}/reject`),

  // Returns { reference, web_payment_link, bank_transfer_account_number,
  // ussd_short_code, expiry_datetime_utc } -- redirect to web_payment_link
  // to complete payment, or show the bank/USSD alternatives instead.
  pagaInit: (orderId) => api.post(`/orders/${orderId}/paga/init`),
  // Manual "check now" fallback -- Paga's webhook is the primary
  // confirmation path and updates the order automatically without this
  // ever being called.
  pagaVerify: (orderId) => api.post(`/orders/${orderId}/paga/verify`),
};

export const userService = {
  list: () => api.get("/users"),
  updateRole: (userId, isAdmin) => api.patch(`/users/${userId}/role`, { is_admin: isAdmin }),
  updateStatus: (userId, isActive) => api.patch(`/users/${userId}/status`, { is_active: isActive }),
  myCredentials: () => api.get("/users/me/credentials"),
};