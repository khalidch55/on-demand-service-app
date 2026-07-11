import { body } from 'express-validator';

export const createBookingValidation = [
  body('serviceId').isInt().withMessage('Valid service ID required'),
  body('dateTime').isISO8601().withMessage('Valid date and time required'),
  body('notes').optional().isString(),
];