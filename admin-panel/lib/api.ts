/**
 * @deprecated
 * This file is kept for backward compatibility only.
 * Please use the new layered API structure instead:
 *
 *   - Axios instance:    @/utils/helpers/common/axios.config
 *   - HTTP helpers:      @/utils/helpers/common/http-methods
 *   - Feature API files: @/lib/api/<feature>.api.ts
 */

// Re-export the Axios instance
export { default } from "@/utils/helpers/common/axios.config";
export { default as axiosInstance } from "@/utils/helpers/common/axios.config";

// Re-export the HTTP helper functions
export {
  getRequest,
  postRequest,
  putRequest,
  patchRequest,
  deleteRequest,
  deleteWithBodyRequest,
  getFilePathWithBackendUrl,
} from "@/utils/helpers/common/http-methods";
