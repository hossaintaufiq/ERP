import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('ge_access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const refresh = localStorage.getItem('ge_refresh_token');
      if (refresh && !error.config._retry) {
        error.config._retry = true;
        try {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken: refresh,
          });
          const payload = data.data || data;
          localStorage.setItem('ge_access_token', payload.accessToken);
          localStorage.setItem('ge_refresh_token', payload.refreshToken);
          error.config.headers.Authorization = `Bearer ${payload.accessToken}`;
          return api.request(error.config);
        } catch {
          localStorage.removeItem('ge_access_token');
          localStorage.removeItem('ge_refresh_token');
          localStorage.removeItem('ge_user');
        }
      }
    }
    return Promise.reject(error);
  },
);

export function unwrap<T = any>(response: any): T {
  const body = response.data;
  if (body?.data !== undefined && body?.meta) return body as T;
  if (body?.data !== undefined) return body.data as T;
  return body as T;
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then(unwrap),
  me: () => api.get('/auth/me').then(unwrap),
  logout: () => api.post('/auth/logout').then(unwrap),
};

export const resources = {
  list: (resource: string, params?: Record<string, any>) =>
    api.get(`/${resource}`, { params }).then(unwrap),
  get: (resource: string, id: string) => api.get(`/${resource}/${id}`).then(unwrap),
  create: (resource: string, body: Record<string, any>) =>
    api.post(`/${resource}`, body).then(unwrap),
  update: (resource: string, id: string, body: Record<string, any>) =>
    api.patch(`/${resource}/${id}`, body).then(unwrap),
  remove: (resource: string, id: string) => api.delete(`/${resource}/${id}`).then(unwrap),
  stats: (resource: string) => api.get(`/${resource}/stats/summary`).then(unwrap),
};

export const erpApi = {
  dashboard: () => api.get('/dashboard/executive').then(unwrap),
  finance: () => api.get('/finance/summary').then(unwrap),
  search: (q: string) => api.get('/search', { params: { q } }).then(unwrap),
  aiAsk: (prompt: string) => api.post('/ai/ask', { prompt }).then(unwrap),
  report: (type: string, timeline?: string) =>
    api.get(`/reports/${type}`, { params: { timeline } }).then(unwrap),
  settings: () => api.get('/settings').then(unwrap),
  updateSettings: (body: Record<string, any>) => api.patch('/settings', body).then(unwrap),
  advancePo: (id: string) => api.post(`/workflow/purchase-orders/${id}/advance`).then(unwrap),
  advanceProduction: (id: string) => api.post(`/workflow/production/${id}/advance`).then(unwrap),
  invoiceShipment: (id: string) => api.post(`/workflow/shipments/${id}/invoice`).then(unwrap),
};
