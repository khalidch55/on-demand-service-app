import { Optional } from 'sequelize';
import { BookingStatus } from '../../enums/booking-status.enum';
import { PaymentStatus } from '../../enums/payment-status.enum';

export interface IBookingAttributes {
  id: number;
  userId: number;
  providerId?: number | null;
  serviceId: number;
  dateTime: Date;
  status: BookingStatus;
  notes?: string | null;
  providerWorkDone: boolean;
  customerWorkDone: boolean;
  amount: number;
  paymentStatus: PaymentStatus;
  paidAt?: Date | null;
  mockTransactionId?: string | null;
  declinedProviderIds?: number[];
  createdAt: Date;
  updatedAt: Date;
}

export type IBookingCreationAttributes = Optional<
  IBookingAttributes,
  | 'id'
  | 'providerId'
  | 'status'
  | 'notes'
  | 'providerWorkDone'
  | 'customerWorkDone'
  | 'amount'
  | 'paymentStatus'
  | 'paidAt'
  | 'mockTransactionId'
  | 'declinedProviderIds'
  | 'createdAt'
  | 'updatedAt'
>;

export interface IMockPaymentInput {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
}
