import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models/User';
import { env } from '../config/env';
import { BadRequestError, UnauthorizedError } from '../utils/errors';
import { UserRole } from '../enums/user-role.enum';

const generateToken = (user: User): string => {
  const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'] };
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, env.JWT_SECRET, options);
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  phone?: string,
  role?: UserRole,
) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new BadRequestError('Email already in use');
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashed,
    phone,
    role: role || UserRole.CUSTOMER,
  });
  const token = generateToken(user);
  return { user: { id: user.id, name, email, role: user.role }, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new UnauthorizedError('Invalid credentials');
  if (user.isActive === false) throw new UnauthorizedError('Account is blocked');
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new UnauthorizedError('Invalid credentials');
  const token = generateToken(user);
  return { user: { id: user.id, name: user.name, email, role: user.role }, token };
};

export const getProfile = async (userId: number) => {
  const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } });
  if (!user) throw new BadRequestError('User not found');
  return user;
};