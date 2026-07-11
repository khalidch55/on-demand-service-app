import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BookingStatus } from '../enums/booking-status.enum';
import { PaymentStatus } from '../enums/payment-status.enum';
import { IBookingAttributes, IBookingCreationAttributes } from '../types/models/booking.types';
import { User } from './User';
import { Service } from './Service';

export { BookingStatus } from '../enums/booking-status.enum';
export { PaymentStatus } from '../enums/payment-status.enum';

@Table({ tableName: 'bookings', timestamps: true })
export class Booking extends Model<IBookingAttributes, IBookingCreationAttributes> implements IBookingAttributes {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare userId: number;

  @BelongsTo(() => User, 'userId')
  customer?: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare providerId?: number | null;

  @BelongsTo(() => User, 'providerId')
  provider?: User;

  @ForeignKey(() => Service)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare serviceId: number;

  @BelongsTo(() => Service)
  service?: Service;

  @Column({ type: DataType.DATE, allowNull: false })
  declare dateTime: Date;

  @Column({ type: DataType.ENUM(...Object.values(BookingStatus)), defaultValue: BookingStatus.PENDING })
  declare status: BookingStatus;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare notes?: string | null;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  declare providerWorkDone: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  declare customerWorkDone: boolean;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false, defaultValue: 0 })
  declare amount: number;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentStatus)),
    allowNull: false,
    defaultValue: PaymentStatus.UNPAID,
  })
  declare paymentStatus: PaymentStatus;

  @Column({ type: DataType.DATE, allowNull: true })
  declare paidAt?: Date | null;

  @Column({ type: DataType.STRING, allowNull: true })
  declare mockTransactionId?: string | null;

  @Column({ type: DataType.JSON, allowNull: true, defaultValue: [] })
  declare declinedProviderIds?: number[];

  declare createdAt: Date;
  declare updatedAt: Date;
}
