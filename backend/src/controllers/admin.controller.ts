import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import * as adminService from '../services/admin.service';
import { UserRole } from '../enums/user-role.enum';

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const role = req.query.role as UserRole | undefined;
  const users = await adminService.getUsers(role);
  sendSuccess(res, users);
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  const user = await adminService.getUserById(id);
  sendSuccess(res, user);
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await adminService.createUser(req.body);
  sendSuccess(res, user, 201);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  const user = await adminService.updateUser(id, req.body);
  sendSuccess(res, user);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  await adminService.deleteUser(id);
  sendSuccess(res, null, 204);
});

export const toggleUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  const { status } = req.body;
  const user = await adminService.toggleUserStatus(id, status);
  sendSuccess(res, user);
});

export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
  const data = await adminService.getDashboard();
  sendSuccess(res, data);
});