import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import * as bookingService from '../services/booking.service';
import { AuthenticatedRequest } from '../middleware/authenticate';

export const createBooking = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { serviceId, dateTime, notes } = req.body;
  const booking = await bookingService.createBooking(req.user!.id, serviceId, new Date(dateTime), notes);
  sendSuccess(res, booking, 201);
});

export const getCustomerBookings = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const bookings = await bookingService.getCustomerBookings(req.user!.id);
  sendSuccess(res, bookings);
});

export const getProviderBookings = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const bookings = await bookingService.getProviderBookings(req.user!.id);
  sendSuccess(res, bookings);
});

export const getPendingBookings = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const bookings = await bookingService.getPendingBookings(req.user!.id);
  sendSuccess(res, bookings);
});

export const rejectBooking = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  const updated = await bookingService.rejectBooking(id, req.user!.id);
  sendSuccess(res, updated);
});

export const completeService = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  const updated = await bookingService.completeService(id, req.user!.id);
  sendSuccess(res, updated);
});

export const processMockPayment = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  const updated = await bookingService.processMockPayment(
    id,
    req.user!.id,
    req.user!.role,
    req.body,
  );
  sendSuccess(res, updated);
});

export const updateBookingStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  const { status } = req.body;
  const updated = await bookingService.updateBookingStatus(id, status, req.user!.id, req.user!.role, req.user!.id);
  sendSuccess(res, updated);
});

export const getAllBookings = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const bookings = await bookingService.getAllBookings();
  sendSuccess(res, bookings);
});

export const getBookingById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  const booking = await bookingService.getBookingByIdForUser(id, req.user!.id, req.user!.role);
  sendSuccess(res, booking);
});

export const assignProvider = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  const { providerId } = req.body;
  const updated = await bookingService.assignProvider(id, parseInt(providerId, 10));
  sendSuccess(res, updated);
});