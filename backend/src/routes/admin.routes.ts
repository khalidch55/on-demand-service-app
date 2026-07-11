import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import * as adminCtrl from '../controllers/admin.controller';
import * as bookingCtrl from '../controllers/booking.controller';
import * as serviceCtrl from '../controllers/service.controller';
import { adminLogin } from '../controllers/auth.controller';
import { adminCreateUserValidation, loginValidation } from '../validators/auth.validator';
import { categoryValidation, serviceValidation } from '../validators/service.validator';
import { validate } from '../middleware/validate';
import { UserRole } from '../enums/user-role.enum';

const router = Router();

// Login
router.post('/login', loginValidation, validate, adminLogin);

// Dashboard
router.get('/dashboard', authenticate, authorize(UserRole.ADMIN), adminCtrl.getDashboard);

// Users
router.get('/users', authenticate, authorize(UserRole.ADMIN), adminCtrl.getUsers);
router.post('/users', authenticate, authorize(UserRole.ADMIN), adminCreateUserValidation, validate, adminCtrl.createUser);
router.get('/users/:id', authenticate, authorize(UserRole.ADMIN), adminCtrl.getUserById);
router.put('/users/:id', authenticate, authorize(UserRole.ADMIN), adminCtrl.updateUser);
router.patch('/users/:id/status', authenticate, authorize(UserRole.ADMIN), adminCtrl.toggleUserStatus);
router.delete('/users/:id', authenticate, authorize(UserRole.ADMIN), adminCtrl.deleteUser);

// Bookings
router.get('/bookings', authenticate, authorize(UserRole.ADMIN), bookingCtrl.getAllBookings);
router.get('/bookings/:id', authenticate, authorize(UserRole.ADMIN), bookingCtrl.getBookingById);
router.patch('/bookings/:id/status', authenticate, authorize(UserRole.ADMIN), bookingCtrl.updateBookingStatus);
router.patch('/bookings/:id/assign', authenticate, authorize(UserRole.ADMIN), bookingCtrl.assignProvider);

// Services
router.get('/services', authenticate, authorize(UserRole.ADMIN), serviceCtrl.getServices);
router.get('/services/:id', authenticate, authorize(UserRole.ADMIN), serviceCtrl.getServiceById);
router.post('/services', authenticate, authorize(UserRole.ADMIN), serviceValidation, validate, serviceCtrl.createService);
router.put('/services/:id', authenticate, authorize(UserRole.ADMIN), serviceValidation, validate, serviceCtrl.updateService);
router.delete('/services/:id', authenticate, authorize(UserRole.ADMIN), serviceCtrl.deleteService);

// Service Categories
router.get('/service-categories', authenticate, authorize(UserRole.ADMIN), serviceCtrl.getCategories);
router.post('/service-categories', authenticate, authorize(UserRole.ADMIN), categoryValidation, validate, serviceCtrl.createCategory);
router.put('/service-categories/:id', authenticate, authorize(UserRole.ADMIN), categoryValidation, validate, serviceCtrl.updateCategory);
router.delete('/service-categories/:id', authenticate, authorize(UserRole.ADMIN), serviceCtrl.deleteCategory);

export default router;