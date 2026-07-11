import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  patchRequest,
} from "@/utils/helpers/common/http-methods";

export const UsersApis = {
  /** Get all users with optional filters */
  getUsers: (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      role?: string;
      status?: string;
    } = {},
    skipLoader = false,
  ) =>
    getRequest("/admin/users", params, { skipGlobalLoader: skipLoader }),

  /** Get a single user by ID */
  getUserById: (id: string | number) =>
    getRequest(`/admin/users/${id}`),

  /** Create a new user */
  createUser: (body: FormData | Record<string, any>) =>
    postRequest("/admin/users", body),

  /** Update user details */
  updateUser: (id: string | number, body: any) =>
    putRequest(`/admin/users/${id}`, body),

  /** Patch specific user fields */
  patchUser: (id: string | number, body: any) =>
    patchRequest(`/admin/users/${id}`, body),

  /** Delete a user */
  deleteUser: (id: string | number) =>
    deleteRequest(`/admin/users/${id}`),

  /** Toggle user active/blocked status */
  toggleUserStatus: (id: string | number, status: "active" | "blocked") =>
    patchRequest(`/admin/users/${id}/status`, { status }),
};
