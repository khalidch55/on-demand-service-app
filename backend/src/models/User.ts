import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { UserRole } from '../enums/user-role.enum';
import { IUserAttributes, IUserCreationAttributes } from '../types/models/user.types';
import { Booking } from './Booking';
import { ProviderAvailability } from './ProviderAvailability';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<IUserAttributes, IUserCreationAttributes> implements IUserAttributes {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare phone?: string | null;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
    defaultValue: UserRole.CUSTOMER,
  })
  declare role: UserRole;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;

  declare createdAt: Date;
  declare updatedAt: Date;

  @HasMany(() => Booking, 'userId')
  bookings?: Booking[];

  @HasMany(() => Booking, 'providerId')
  providerBookings?: Booking[];

  @HasMany(() => ProviderAvailability, 'providerId')
  availabilities?: ProviderAvailability[];
}
