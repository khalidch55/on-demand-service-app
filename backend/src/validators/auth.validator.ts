import { body } from 'express-validator';
import { PUBLIC_REGISTRATION_ROLES } from '../enums/user-role.enum';

export const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 characters'),
  body('phone').optional().isMobilePhone('any'),
  body('role')
    .optional()
    .isIn(PUBLIC_REGISTRATION_ROLES)
    .withMessage('Role must be customer or provider'),
];

export const adminCreateUserValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 characters'),
  body('phone').optional().isMobilePhone('any'),
  body('role')
    .isIn(PUBLIC_REGISTRATION_ROLES)
    .withMessage('Role must be customer or provider'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];