import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ===== CONFIGURAÇÃO DE BASE URL =====
// Emulador Android: 10.0.2.2 mapeia para o localhost da máquina host
// iOS Simulator:    use 'http://localhost:3000/api'
// Device físico:    use o IP da sua máquina na rede local (ex.: http://192.168.1.10:3000/api)
// Produção:         substitua pela URL pública (ex.: https://api.seudominio.com/api)
const BASE_URL = 'http://10.0.2.2:3000/api';

const TOKEN_KEY = '@GestaoCondominio:accessToken';
const REFRESH_KEY = '@GestaoCondominio:refreshToken';
const USER_KEY = '@GestaoCondominio:user';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

function sanitizeQueryParams(params) {
  if (!params || typeof params !== 'object' || Array.isArray(params)) return params;

  const cleaned = {};
  const shouldDrop = (value) => {
    if (value === undefined || value === null) return true;
    if (typeof value === 'number' && Number.isNaN(value)) return true;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (
        trimmed === '' ||
        trimmed.toLowerCase() === 'undefined' ||
        trimmed.toLowerCase() === 'null' ||
        trimmed.toLowerCase() === 'nan'
      ) {
        return true;
      }
    }
    return false;
  };

  Object.entries(params).forEach(([key, value]) => {
    if (shouldDrop(value)) return;
    if (Array.isArray(value)) {
      const arr = value.filter((item) => !shouldDrop(item));
      if (arr.length > 0) cleaned[key] = arr;
      return;
    }
    cleaned[key] = value;
  });

  return cleaned;
}

// ===== Helpers de storage =====
export const tokenStorage = {
  async getAccess() {
    return AsyncStorage.getItem(TOKEN_KEY);
  },
  async getRefresh() {
    return AsyncStorage.getItem(REFRESH_KEY);
  },
  async getUser() {
    const raw = await AsyncStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  async setAll({ accessToken, refreshToken, usuario }) {
    if (accessToken) await AsyncStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) await AsyncStorage.setItem(REFRESH_KEY, refreshToken);
    if (usuario) await AsyncStorage.setItem(USER_KEY, JSON.stringify(usuario));
  },
  async clear() {
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_KEY, USER_KEY]);
  },
};

// ===== Request interceptor: anexa o accessToken =====
api.interceptors.request.use(async (config) => {
  config.params = sanitizeQueryParams(config.params);
  const token = await tokenStorage.getAccess();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===== Response interceptor: refresh token rotation em 401 =====
let isRefreshing = false;
let pendingQueue = [];

function flushQueue(error, newToken = null) {
  pendingQueue.forEach((p) => (error ? p.reject(error) : p.resolve(newToken)));
  pendingQueue = [];
}

let onUnauthorizedHandler = null;
export function setOnUnauthorized(fn) {
  onUnauthorizedHandler = fn;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    // Não tenta refresh se: não é 401, requisição já foi retentada, ou é uma rota de auth
    const isAuthRoute =
      original?.url?.includes('/auth/login') ||
      original?.url?.includes('/auth/refresh') ||
      original?.url?.includes('/auth/forgot-password') ||
      original?.url?.includes('/auth/reset-password');

    if (status !== 401 || original._retry || isAuthRoute) {
      return Promise.reject(error);
    }

    // Se já há um refresh em andamento, fila as requests
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        })
        .catch((err) => Promise.reject(err));
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await tokenStorage.getRefresh();
      if (!refreshToken) throw new Error('Sem refresh token');

      const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
      await tokenStorage.setAll({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        usuario: data.usuario,
      });
      flushQueue(null, data.accessToken);

      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(original);
    } catch (err) {
      flushQueue(err, null);
      await tokenStorage.clear();
      if (onUnauthorizedHandler) onUnauthorizedHandler();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);

export { BASE_URL };
export default api;
