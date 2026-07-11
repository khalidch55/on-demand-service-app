import { Booking } from '../models/Booking';

import { BookingStatus } from '../enums/booking-status.enum';

import { PaymentStatus } from '../enums/payment-status.enum';

import { Service } from '../models/Service';

import { User } from '../models/User';

import { BadRequestError, NotFoundError, ForbiddenError } from '../utils/errors';

import { UserRole } from '../enums/user-role.enum';

import { IMockPaymentInput } from '../types/models/booking.types';

import { Op } from 'sequelize';



const generateMockTransactionId = () =>
  `MOCK-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;



export const createBooking = async (customerId: number, serviceId: number, dateTime: Date, notes?: string) => {

  const service = await Service.findByPk(serviceId);

  if (!service || !service.isActive) throw new BadRequestError('Service not available');

  return Booking.create({

    userId: customerId,

    serviceId,

    dateTime,

    notes,

    status: BookingStatus.PENDING,

    amount: service.price,

    paymentStatus: PaymentStatus.UNPAID,

    declinedProviderIds: [],

  });

};



export const getCustomerBookings = async (userId: number) => {

  return Booking.findAll({

    where: { userId },

    include: [{ model: Service }, { model: User, as: 'provider' }],

    order: [['dateTime', 'DESC']],

  });

};



export const getProviderBookings = async (providerId: number) => {

  return Booking.findAll({

    where: { providerId },

    include: [{ model: Service }, { model: User, as: 'customer' }],

    order: [['dateTime', 'DESC']],

  });

};



export const getPendingBookings = async (providerId: number) => {

  const bookings = await Booking.findAll({

    where: { status: BookingStatus.PENDING, providerId: { [Op.is]: null } },

    include: [{ model: Service }, { model: User, as: 'customer' }],

    order: [['dateTime', 'ASC']],

  });



  return bookings.filter((booking) => {

    const declined = booking.declinedProviderIds ?? [];

    return !declined.includes(providerId);

  });

};



export const rejectBooking = async (bookingId: number, providerId: number) => {

  const booking = await Booking.findByPk(bookingId);

  if (!booking) throw new NotFoundError('Booking not found');



  if (booking.status !== BookingStatus.PENDING || booking.providerId) {

    throw new BadRequestError('Can only reject pending unassigned bookings');

  }



  const declined = [...(booking.declinedProviderIds ?? [])];

  if (!declined.includes(providerId)) {

    declined.push(providerId);

  }

  booking.declinedProviderIds = declined;

  return booking.save();

};



export const completeService = async (bookingId: number, providerId: number) => {
  const booking = await Booking.findByPk(bookingId);
  if (!booking) throw new NotFoundError('Booking not found');
  if (booking.providerId !== providerId) throw new ForbiddenError('Not your booking');
  if (booking.status !== BookingStatus.IN_PROGRESS) {
    throw new BadRequestError('Can only complete in-progress bookings');
  }
  booking.providerWorkDone = true;
  booking.status = BookingStatus.AWAITING_PAYMENT;
  return booking.save();
};

/** @deprecated Use completeService — kept for route compatibility */
export const markWorkDone = async (bookingId: number, userId: number, userRole: UserRole) => {
  if (userRole === UserRole.PROVIDER) {
    return completeService(bookingId, userId);
  }
  throw new ForbiddenError('Only providers can mark service as complete');
};



export const processMockPayment = async (

  bookingId: number,

  userId: number,

  userRole: UserRole,

  payment: IMockPaymentInput,

) => {

  const booking = await Booking.findByPk(bookingId, { include: [{ model: Service }] });

  if (!booking) throw new NotFoundError('Booking not found');



  if (userRole !== UserRole.CUSTOMER) {
    throw new ForbiddenError('Only customers can make payments');
  }
  if (booking.userId !== userId) {
    throw new ForbiddenError('Not your booking');
  }

  if (booking.status !== BookingStatus.AWAITING_PAYMENT) {

    throw new BadRequestError('Booking is not ready for payment');

  }

  if (booking.paymentStatus === PaymentStatus.PAID) {

    throw new BadRequestError('Booking is already paid');

  }



  const cardDigits = payment.cardNumber.replace(/\s/g, '');

  if (!/^\d{16}$/.test(cardDigits)) throw new BadRequestError('Invalid card number (use 16 digits)');

  if (!payment.cardHolder.trim()) throw new BadRequestError('Card holder name is required');

  if (!/^\d{2}\/\d{2}$/.test(payment.expiry)) throw new BadRequestError('Expiry must be MM/YY');

  if (!/^\d{3,4}$/.test(payment.cvv)) throw new BadRequestError('Invalid CVV');



  booking.paymentStatus = PaymentStatus.PAID;
  booking.paidAt = new Date();
  booking.mockTransactionId = generateMockTransactionId();
  booking.customerWorkDone = true;
  booking.status = BookingStatus.COMPLETED;

  if (!booking.amount && booking.service) {

    booking.amount = Number(booking.service.price);

  }

  return booking.save();

};



export const updateBookingStatus = async (

  bookingId: number,

  status: string,

  userId: number,

  userRole: UserRole,

  userProviderId?: number,

) => {

  const booking = await Booking.findByPk(bookingId);

  if (!booking) throw new NotFoundError('Booking not found');



  const newStatus = status as BookingStatus;

  if (!Object.values(BookingStatus).includes(newStatus)) {

    throw new BadRequestError('Invalid status');

  }



  if (userRole === UserRole.PROVIDER) {

    if (booking.providerId && booking.providerId !== userProviderId) {

      throw new ForbiddenError('Not your booking');

    }

    if (!booking.providerId) {

      if (newStatus === BookingStatus.ACCEPTED) {

        if (booking.status !== BookingStatus.PENDING) {

          throw new BadRequestError('Can only accept pending bookings');

        }

      } else {

        throw new ForbiddenError('Use reject endpoint to decline pending bookings');

      }

    } else {

      const allowed: BookingStatus[] = [BookingStatus.IN_PROGRESS, BookingStatus.CANCELLED];

      if (!allowed.includes(newStatus)) {

        throw new BadRequestError('Invalid status transition for provider');

      }

      if (newStatus === BookingStatus.IN_PROGRESS && booking.status !== BookingStatus.ACCEPTED) {

        throw new BadRequestError('Can only start accepted bookings');

      }

      if (newStatus === BookingStatus.CANCELLED && booking.status !== BookingStatus.ACCEPTED) {

        throw new BadRequestError('Can only cancel accepted bookings before work starts');

      }

    }

  } else if (userRole === UserRole.CUSTOMER) {

    if (booking.userId !== userId) throw new ForbiddenError('Not your booking');

    if (newStatus === BookingStatus.CANCELLED && booking.status !== BookingStatus.PENDING) {

      throw new BadRequestError('Can only cancel pending bookings');

    }

    if (newStatus !== BookingStatus.CANCELLED) throw new ForbiddenError('Cannot change status');

  } else if (userRole !== UserRole.ADMIN) {

    throw new ForbiddenError('Insufficient privileges');

  }



  booking.status = newStatus;

  if (newStatus === BookingStatus.ACCEPTED && !booking.providerId) {

    booking.providerId = userId;

  }

  return booking.save();

};



export const getBookingById = async (bookingId: number) => {

  const booking = await Booking.findByPk(bookingId, {

    include: [{ model: Service }, { model: User, as: 'customer' }, { model: User, as: 'provider' }],

  });

  if (!booking) throw new NotFoundError('Booking not found');

  return booking;

};



export const getBookingByIdForUser = async (bookingId: number, userId: number, userRole: UserRole) => {

  const booking = await getBookingById(bookingId);

  if (userRole === UserRole.ADMIN) return booking;

  if (userRole === UserRole.CUSTOMER && booking.userId === userId) return booking;

  if (userRole === UserRole.PROVIDER && (booking.providerId === userId || !booking.providerId)) return booking;

  throw new ForbiddenError('Not your booking');

};



export const getAllBookings = async () => {

  return Booking.findAll({

    include: [{ model: Service }, { model: User, as: 'customer' }, { model: User, as: 'provider' }],

    order: [['createdAt', 'DESC']],

  });

};



export const assignProvider = async (bookingId: number, providerId: number) => {

  const booking = await Booking.findByPk(bookingId);

  if (!booking) throw new NotFoundError('Booking not found');

  const provider = await User.findOne({ where: { id: providerId, role: UserRole.PROVIDER } });

  if (!provider) throw new BadRequestError('Invalid provider');

  booking.providerId = providerId;

  if (booking.status === BookingStatus.PENDING) {

    booking.status = BookingStatus.ACCEPTED;

  }

  return booking.save();

};

