import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { categoryValidation, serviceValidation } from '../validators/service.validator';
import * as serviceCtrl from '../controllers/service.controller';
import { UserRole } from '../enums/user-role.enum';

const router = Router();

// Categories
router.post('/categories', authenticate, authorize(UserRole.ADMIN), categoryValidation, validate, serviceCtrl.createCategory);
router.get('/categories', authenticate, serviceCtrl.getCategories);
router.put('/categories/:id', authenticate, authorize(UserRole.ADMIN), categoryValidation, validate, serviceCtrl.updateCategory);
router.delete('/categories/:id', authenticate, authorize(UserRole.ADMIN), serviceCtrl.deleteCategory);

// Services
router.post('/', authenticate, authorize(UserRole.ADMIN), serviceValidation, validate, serviceCtrl.createService);
router.get('/', authenticate, serviceCtrl.getServices);
router.get('/:id', authenticate, serviceCtrl.getServiceById);
router.put('/:id', authenticate, authorize(UserRole.ADMIN), serviceValidation, validate, serviceCtrl.updateService);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), serviceCtrl.deleteService);

export default router;