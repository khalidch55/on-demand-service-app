import { body } from 'express-validator';

export const categoryValidation = [
  body('name').notEmpty().withMessage('Category name required'),
  body('description').optional(),
];

export const serviceValidation = [
  body('name').notEmpty().withMessage('Service name required'),
  body('description').optional(),
  body('price').isFloat({ min: 0 }).withMessage('Price must be >=0'),
  body('durationMinutes').isInt({ min: 1 }).withMessage('Duration required'),
  body('categoryId').isInt().withMessage('Valid category ID required'),
  body('isActive').optional().isBoolean(),
];