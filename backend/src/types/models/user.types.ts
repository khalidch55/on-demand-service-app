import { Optional } from 'sequelize';
import { UserRole } from '../../enums/user-role.enum';

/** Database column shape for users table */
export interface IUserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  phone?: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Fields optional when creating a user */
export type IUserCreationAttributes = Optional<
  IUserAttributes,
  'id' | 'phone' | 'role' | 'isActive' | 'createdAt' | 'updatedAt'
>;

/** Safe user object returned from APIs (no password) */
export type IUserPublic = Omit<IUserAttributes, 'password'>;

/** Input for admin-created users */
export type IAdminCreateUserInput = Required<
  Pick<IUserAttributes, 'name' | 'email' | 'password' | 'role'>
> & {
  phone?: string;
};
