import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import * as availService from '../services/availability.service';
import { AuthenticatedRequest } from '../middleware/authenticate';

export const addAvailability = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { dayOfWeek, startTime, endTime } = req.body;
  const slot = await availService.addAvailability(req.user!.id, dayOfWeek, startTime, endTime);
  sendSuccess(res, slot, 201);
});

export const getMyAvailability = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const slots = await availService.getMyAvailability(req.user!.id);
  sendSuccess(res, slots);
});

export const updateAvailability = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const id = Number(req.params.id);
  const slot = await availService.updateAvailability(id, req.user!.id, req.body);
  sendSuccess(res, slot);
});

export const deleteAvailability = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const id = Number(req.params.id);
  await availService.deleteAvailability(id, req.user!.id);
  sendSuccess(res, null, 204);
});