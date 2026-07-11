import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { IServiceAttributes, IServiceCreationAttributes } from '../types/models/service.types';
import { ServiceCategory } from './ServiceCategory';
import { Booking } from './Booking';

@Table({ tableName: 'services', timestamps: true })
export class Service extends Model<IServiceAttributes, IServiceCreationAttributes> implements IServiceAttributes {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description?: string | null;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare price: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare durationMinutes: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare isActive: boolean;

  @ForeignKey(() => ServiceCategory)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare categoryId: number;

  declare createdAt: Date;
  declare updatedAt: Date;

  @BelongsTo(() => ServiceCategory)
  category?: ServiceCategory;

  @HasMany(() => Booking)
  bookings?: Booking[];
}
