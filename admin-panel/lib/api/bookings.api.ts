import {
  getRequest,
  postRequest,
  putRequest,
  patchRequest,
} from "@/utils/helpers/common/http-methods";

export const BookingsApis = {
  /** Get all bookings with optional filters */
  getBookings: (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      serviceId?: string | number;
      userId?: string | number;
      fromDate?: string;
      toDate?: string;
    } = {},
    skipLoader = false,
  ) =>
    getRequest("/admin/bookings", params, { skipGlobalLoader: skipLoader }),

  /** Get a single booking by ID */
  getBookingById: (id: string | number) =>
    getRequest(`/admin/bookings/${id}`),

  /** Create a new booking (admin-initiated) */
  createBooking: (body: any) =>
    postRequest("/admin/bookings", body),

  /** Update booking details */
  updateBooking: (id: string | number, body: any) =>
    putRequest(`/admin/bookings/${id}`, body),

  /** Update booking status */
  updateBookingStatus: (
    id: string | number,
    status:
      | "pending"
      | "accepted"
      | "rejected"
      | "in_progress"
      | "awaiting_payment"
      | "completed"
      | "cancelled",
  ) =>
    patchRequest(`/admin/bookings/${id}/status`, { status }),

  /** Assign a service provider to a booking */
  assignProvider: (id: string | number, providerId: string | number) =>
    patchRequest(`/admin/bookings/${id}/assign`, { providerId }),

  /** Get booking statistics */
  getBookingStats: (skipLoader = false) =>
    getRequest("/admin/bookings/stats", {}, { skipGlobalLoader: skipLoader }),
};
