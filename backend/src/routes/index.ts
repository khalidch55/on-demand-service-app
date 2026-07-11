import { Router } from 'express';
import authRoutes from './auth.routes';
import serviceRoutes from './service.routes';
import bookingRoutes from './booking.routes';
import availabilityRoutes from './availability.routes';
import adminRoutes from './admin.routes';

const router = Router();
router.use('/auth', authRoutes);
router.use('/services', serviceRoutes);
router.use('/bookings', bookingRoutes);
router.use('/availability', availabilityRoutes);
router.use('/admin', adminRoutes);

export default router;