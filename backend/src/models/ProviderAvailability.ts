import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import {
  IProviderAvailabilityAttributes,
  IProviderAvailabilityCreationAttributes,
} from '../types/models/provider-availability.types';
import { User } from './User';

@Table({ tableName: 'provider_availabilities', timestamps: true })
export class ProviderAvailability extends Model<
  IProviderAvailabilityAttributes,
  IProviderAvailabilityCreationAttributes
> implements IProviderAvailabilityAttributes {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare providerId: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare dayOfWeek: number;

  @Column({ type: DataType.TIME, allowNull: false })
  declare startTime: string;

  @Column({ type: DataType.TIME, allowNull: false })
  declare endTime: string;

  declare createdAt: Date;
  declare updatedAt: Date;

  @BelongsTo(() => User)
  provider?: User;
}
