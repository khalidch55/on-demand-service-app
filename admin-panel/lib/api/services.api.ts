import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  patchRequest,
} from "@/utils/helpers/common/http-methods";

export const ServicesApis = {
  /** Get all services with optional filters */
  getServices: (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      category?: string;
      status?: string;
    } = {},
    skipLoader = false,
  ) =>
    getRequest("/admin/services", params, { skipGlobalLoader: skipLoader }),

  /** Get a single service by ID */
  getServiceById: (id: string | number) =>
    getRequest(`/admin/services/${id}`),

  /** Create a new service */
  createService: (body: Record<string, unknown>) =>
    postRequest("/admin/services", body),

  /** Update service details */
  updateService: (id: string | number, body: Record<string, unknown>) =>
    putRequest(`/admin/services/${id}`, body),

  /** Patch specific service fields */
  patchService: (id: string | number, body: any) =>
    patchRequest(`/admin/services/${id}`, body),

  /** Delete a service */
  deleteService: (id: string | number) =>
    deleteRequest(`/admin/services/${id}`),

  /** Toggle service active/inactive status */
  toggleServiceStatus: (
    id: string | number,
    status: "active" | "inactive",
  ) =>
    patchRequest(`/admin/services/${id}/status`, { status }),

  /** Get all service categories */
  getServiceCategories: (skipLoader = false) =>
    getRequest("/admin/service-categories", {}, { skipGlobalLoader: skipLoader }),

  createCategory: (body: { name: string; description?: string }) =>
    postRequest("/admin/service-categories", body),

  updateCategory: (id: string | number, body: { name: string; description?: string }) =>
    putRequest(`/admin/service-categories/${id}`, body),

  deleteCategory: (id: string | number) =>
    deleteRequest(`/admin/service-categories/${id}`),
};
