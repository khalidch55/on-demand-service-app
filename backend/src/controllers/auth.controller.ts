import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import { registerUser, loginUser, getProfile } from '../services/auth.service';
import { AuthenticatedRequest } from '../middleware/authenticate';
import { NotFoundError, UnauthorizedError } from '../utils/errors';
import { User } from '../models/User';
import { UserRole } from '../enums/user-role.enum';

const setTokenCookie = (res: Response, token: string) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;
  const data = await registerUser(name, email, password, phone, role);
  setTokenCookie(res, data.token);
  sendSuccess(res, data, 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const data = await loginUser(email, password);
  setTokenCookie(res, data.token);
  sendSuccess(res, data);
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie('token');
  sendSuccess(res, { message: 'Logged out successfully' });
});

export const getMe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await getProfile(req.user!.id);
  sendSuccess(res, user);
});

export const updateProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { name, phone } = req.body;
  const user = await User.findByPk(req.user!.id);
  if (!user) throw new NotFoundError('User not found');
  await user.update({ name, phone });
  sendSuccess(res, { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role });
});

export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const data = await loginUser(email, password);
  if (data.user.role !== UserRole.ADMIN) {
    throw new UnauthorizedError('Access denied: Admins only');
  }
  setTokenCookie(res, data.token);
  sendSuccess(res, data);
});