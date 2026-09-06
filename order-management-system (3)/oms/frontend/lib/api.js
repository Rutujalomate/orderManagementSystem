import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || err.message || "something went wrong";
    return Promise.reject({ ...err, message, details: err.response?.data?.details });
  }
);

export const OrdersAPI = {
  create: (payload) => api.post("/orders", payload).then((r) => r.data),
  list: (params) => api.get("/orders", { params }).then((r) => r.data),
  getById: (id) => api.get(`/orders/${id}`).then((r) => r.data),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }).then((r) => r.data),
  cancel: (id) => api.delete(`/orders/${id}`).then((r) => r.data),
};

export const AnalyticsAPI = {
  ordersPerDay: (params) => api.get("/analytics/orders-per-day", { params }).then((r) => r.data),
  revenuePerStore: () => api.get("/analytics/revenue-per-store").then((r) => r.data),
  topItems: (params) => api.get("/analytics/top-items", { params }).then((r) => r.data),
};

export default api;
