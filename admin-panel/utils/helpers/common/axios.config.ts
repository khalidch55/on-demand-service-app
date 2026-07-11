import axios, { type InternalAxiosRequestConfig } from "axios";
import { store } from "@/store";
import { sharedActions } from "@/store/slices/shared.slice";
import { logout as authLogout } from "@/store/slices/auth.slice";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    skipGlobalLoader?: boolean;
  }
}

const rawBaseURL = process.env.NEXT_PUBLIC_API_URL || "";
const normalizedBaseURL = rawBaseURL.replace(/\/+$/, "");

const Request = axios.create({
  baseURL: normalizedBaseURL,
  timeout: 30000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/** URL prefixes that should NOT trigger the global loader */
const URL_PATHS_SKIP_GLOBAL_LOADER: RegExp[] = [
  /^\/notifications/,
  /^\/device-tokens/,
];

function shouldSkipGlobalLoaderByUrl(url: string | undefined): boolean {
  if (!url) return false;
  const path = url.split("?")[0] || url;
  return URL_PATHS_SKIP_GLOBAL_LOADER.some((re) => re.test(path));
}

function trackLoaderForConfig(config: InternalAxiosRequestConfig): boolean {
  if (typeof window === "undefined") return false;
  if (config.skipGlobalLoader) return false;
  if (shouldSkipGlobalLoaderByUrl(config.url)) return false;
  return true;
}

// ─── Request Interceptor ─────────────────────────────────────────────────────
Request.interceptors.request.use(
  (config) => {
    // Attach Bearer token from localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Increment global loader counter
    const trackLoader = trackLoaderForConfig(config);
    if (trackLoader) {
      store.dispatch(sharedActions.beginApiRequest());
    }
    (
      config as InternalAxiosRequestConfig & { __loaderTracked?: boolean }
    ).__loaderTracked = trackLoader;

    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor ────────────────────────────────────────────────────
Request.interceptors.response.use(
  (response) => {
    const cfg = response.config as InternalAxiosRequestConfig & {
      __loaderTracked?: boolean;
    };
    if (cfg.__loaderTracked) {
      store.dispatch(sharedActions.endApiRequest());
    }
    return response;
  },
  async (error) => {
    const cfg = error.config as
      | (InternalAxiosRequestConfig & { __loaderTracked?: boolean })
      | undefined;
    if (cfg?.__loaderTracked) {
      store.dispatch(sharedActions.endApiRequest());
    }

    // Auto-logout on 401 Unauthorized
    if (error?.response?.status === 401) {
      const url = error.config?.url || "";
      const isAuthAttempt =
        url.endsWith("/login") ||
        url.includes("/auth/") ||
        url.includes("/admin/login");

      if (!isAuthAttempt) {
        store.dispatch(sharedActions.logout());
        store.dispatch(authLogout());
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          const currentPath =
            window.location.pathname + window.location.search;
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
    }

    return Promise.reject(error);
  },
);

export default Request;
