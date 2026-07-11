import Request from "./axios.config";
import { errorToaster } from "./alert-service";
import { errorMessages, warningMessages } from "../enums/messages.enum";
import { store } from "@/store";
import { logout as authLogout } from "@/store/slices/auth.slice";
import { sharedActions } from "@/store/slices/shared.slice";

const getHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    Authorization: `Bearer ${token}`,
    Accept: "*/*",
  };
};

// ─── GET ─────────────────────────────────────────────────────────────────────
export const getRequest = async (
  url: string,
  params: any = {},
  options: { skipGlobalLoader?: boolean } = {},
) => {
  try {
    const headers = getHeaders();
    const response = await Request.get(url, {
      params,
      headers,
      ...(options.skipGlobalLoader !== undefined && {
        skipGlobalLoader: options.skipGlobalLoader,
      }),
    } as any);
    return response.data;
  } catch (error) {
    return errorHandler(error);
  }
};

// ─── POST ────────────────────────────────────────────────────────────────────
export const postRequest = async (url: string, data: any, params: any = {}) => {
  try {
    const headers = getHeaders();
    const response = await Request.post(url, data, { params, headers });
    return response.data;
  } catch (error) {
    return errorHandler(error);
  }
};

// ─── PUT ─────────────────────────────────────────────────────────────────────
export const putRequest = async (url: string, data: any, params: any = {}) => {
  try {
    const headers = getHeaders();
    const response = await Request.put(url, data, { params, headers });
    return response.data;
  } catch (error) {
    return errorHandler(error);
  }
};

// ─── PATCH ───────────────────────────────────────────────────────────────────
export const patchRequest = async (
  url: string,
  data: any,
  params: any = {},
) => {
  try {
    const headers = getHeaders();
    const response = await Request.patch(url, data, { params, headers });
    return response.data;
  } catch (error) {
    return errorHandler(error);
  }
};

// ─── DELETE ──────────────────────────────────────────────────────────────────
export const deleteRequest = async (url: string, params: any = {}) => {
  try {
    const headers = getHeaders();
    const response = await Request.delete(url, { params, headers });
    return response.data;
  } catch (error) {
    return errorHandler(error);
  }
};

// ─── DELETE WITH BODY ────────────────────────────────────────────────────────
export const deleteWithBodyRequest = async (url: string, data: any) => {
  try {
    const headers = getHeaders();
    const response = await Request.delete(url, { data, headers });
    return response.data;
  } catch (error) {
    return errorHandler(error);
  }
};

// ─── Error Handler ───────────────────────────────────────────────────────────
const errorHandler = (error: any) => {
  const backendData = error?.response?.data;
  const errors = backendData?.errors || backendData?.error;
  let messageToDisplay =
    backendData?.message || error?.message || errorMessages.somethingWentWrong;

  // Use the errors string if provided, as it's often more specific
  if (typeof errors === "string") {
    messageToDisplay = errors;
  }

  if (error.response) {
    const statusCode = error.response.status;

    if (statusCode === 401) {
      const url = error.config?.url || "";
      const isAuthAttempt =
        url.endsWith("/login") ||
        url.includes("/auth/") ||
        url.includes("/admin/login");

      if (!isAuthAttempt) {
        errorToaster(warningMessages.sessionExpired);
        store.dispatch(sharedActions.logout());
        store.dispatch(authLogout());
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
        return {
          success: false,
          message: warningMessages.sessionExpired,
          error: warningMessages.sessionExpired,
        };
      }
    }

    if (Array.isArray(errors) && errors.length > 0) {
      errors.forEach((err: string) => {
        errorToaster(err);
      });
    } else if (messageToDisplay) {
      errorToaster(messageToDisplay);
    }
  } else if (messageToDisplay) {
    errorToaster(messageToDisplay);
  }

  return { success: false, message: messageToDisplay, error: messageToDisplay };
};

// ─── Utility ─────────────────────────────────────────────────────────────────
/**
 * Resolves a relative media path to a full absolute URL using the
 * NEXT_PUBLIC_MEDIA_BASE_URL environment variable.
 */
export const getFilePathWithBackendUrl = (path: any): string => {
  if (typeof path !== "string") {
    return "";
  }

  let cleanPath = path.trim();

  // API sometimes returns base URL prepended to an already-absolute URL
  const embeddedUrlMatch = cleanPath.match(
    /^https?:\/\/[^/]+\/(https?:\/\/.+)$/i,
  );
  if (embeddedUrlMatch) {
    cleanPath = embeddedUrlMatch[1];
  }

  const mediaBaseUrl = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL || "").trim();
  if (
    mediaBaseUrl &&
    !mediaBaseUrl.includes("localhost") &&
    (cleanPath.startsWith("http://localhost:") ||
      cleanPath.startsWith("https://localhost:"))
  ) {
    cleanPath = cleanPath.replace(/^https?:\/\/localhost:\d+\/?/i, "/");
  }

  if (!cleanPath.startsWith("http")) {
    const baseUrl = mediaBaseUrl;
    const hasBaseSlash = baseUrl.endsWith("/");
    const hasPathSlash = cleanPath.startsWith("/");

    if (hasBaseSlash && hasPathSlash) {
      cleanPath = baseUrl + cleanPath.slice(1);
    } else if (!hasBaseSlash && !hasPathSlash) {
      cleanPath = baseUrl + "/" + cleanPath;
    } else {
      cleanPath = baseUrl + cleanPath;
    }
  }

  return encodeURI(cleanPath);
};
