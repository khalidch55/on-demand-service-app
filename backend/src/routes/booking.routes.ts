import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { createBookingValidation } from '../validators/booking.validator';
import { mockPaymentValidation } from '../validators/payment.validator';
import * as bookingCtrl from '../controllers/booking.controller';
import { UserRole } from '../enums/user-role.enum';

const router = Router();

router.post('/', authenticate, authorize(UserRole.CUSTOMER), createBookingValidation, validate, bookingCtrl.createBooking);
router.get('/my', authenticate, authorize(UserRole.CUSTOMER), bookingCtrl.getCustomerBookings);
router.get('/provider', authenticate, authorize(UserRole.PROVIDER), bookingCtrl.getProviderBookings);
router.get('/pending', authenticate, authorize(UserRole.PROVIDER), bookingCtrl.getPendingBookings);
router.get('/:id', authenticate, bookingCtrl.getBookingById);
router.put('/:id/reject', authenticate, authorize(UserRole.PROVIDER), bookingCtrl.rejectBooking);
router.put('/:id/complete', authenticate, authorize(UserRole.PROVIDER), bookingCtrl.completeService);
router.put('/:id/work-done', authenticate, authorize(UserRole.PROVIDER), bookingCtrl.completeService);
router.post('/:id/pay', authenticate, authorize(UserRole.CUSTOMER), mockPaymentValidation, validate, bookingCtrl.processMockPayment);
router.put('/:id/status', authenticate, authorize(UserRole.PROVIDER, UserRole.ADMIN, UserRole.CUSTOMER), bookingCtrl.updateBookingStatus);
router.get('/', authenticate, authorize(UserRole.ADMIN), bookingCtrl.getAllBookings);

export default router;
