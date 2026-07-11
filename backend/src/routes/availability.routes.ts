import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { availabilityValidation } from '../validators/availability.validator';
import * as availCtrl from '../controllers/availability.controller';
import { UserRole } from '../enums/user-role.enum';

const router = Router();

router.post('/', authenticate, authorize(UserRole.PROVIDER), availabilityValidation, validate, availCtrl.addAvailability);
router.get('/my', authenticate, authorize(UserRole.PROVIDER), availCtrl.getMyAvailability);
router.put('/:id', authenticate, authorize(UserRole.PROVIDER), availabilityValidation, validate, availCtrl.updateAvailability);
router.delete('/:id', authenticate, authorize(UserRole.PROVIDER), availCtrl.deleteAvailability);

export default router;
