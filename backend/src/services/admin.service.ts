import { User } from '../models/User';
import { IUserCreationAttributes, IAdminCreateUserInput } from '../types/models/user.types';
import { Booking } from '../models/Booking';
import { Service } from '../models/Service';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { UserRole } from '../enums/user-role.enum';
import bcrypt from 'bcryptjs';

export const getUsers = async (role?: UserRole) => {
  const where = role ? { role } : {};
  return User.findAll({ where, attributes: { exclude: ['password'] } });
};

export const getUserById = async (id: number) => {
  const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
  if (!user) throw new NotFoundError('User not found');
  return user;
};

export const createUser = async (data: IAdminCreateUserInput) => {
  if (data.role === UserRole.ADMIN) {
    throw new BadRequestError('Cannot create admin users from this endpoint');
  }
  const existing = await User.findOne({ where: { email: data.email } });
  if (existing) throw new BadRequestError('Email already in use');
  const hashed = await bcrypt.hash(data.password, 10);
  const user = await User.create({ ...data, password: hashed });
  return User.findByPk(user.id, { attributes: { exclude: ['password'] } });
};

export const updateUser = async (
  id: number,
  data: Partial<Pick<IUserCreationAttributes, 'name' | 'phone' | 'role'>>,
) => {
  const user = await User.findByPk(id);
  if (!user) throw new NotFoundError('User not found');
  if (data.role === UserRole.ADMIN) {
    throw new BadRequestError('Cannot assign admin role');
  }
  await user.update(data);
  return User.findByPk(id, { attributes: { exclude: ['password'] } });
};

export const deleteUser = async (id: number) => {
  const user = await User.findByPk(id);
  if (!user) throw new NotFoundError('User not found');
  await user.destroy();
};

export const toggleUserStatus = async (id: number, status: 'active' | 'blocked') => {
  const user = await User.findByPk(id);
  if (!user) throw new NotFoundError('User not found');
  await user.update({ isActive: status === 'active' });
  return User.findByPk(id, { attributes: { exclude: ['password'] } });
};

export const getDashboard = async () => {
  const [totalUsers, totalCustomers, totalProviders, totalBookings, pendingBookings, completedBookings, totalServices] =
    await Promise.all([
      User.count(),
      User.count({ where: { role: UserRole.CUSTOMER } }),
      User.count({ where: { role: UserRole.PROVIDER } }),
      Booking.count(),
      Booking.count({ where: { status: 'pending' } }),
      Booking.count({ where: { status: 'completed' } }),
      Service.count(),
    ]);
  return { totalUsers, totalCustomers, totalProviders, totalBookings, pendingBookings, completedBookings, totalServices };
};