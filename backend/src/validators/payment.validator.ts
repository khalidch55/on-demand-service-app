import { body } from 'express-validator';

export const mockPaymentValidation = [
  body('cardNumber').trim().notEmpty().withMessage('Card number is required'),
  body('cardHolder').trim().notEmpty().withMessage('Card holder is required'),
  body('expiry').trim().matches(/^\d{2}\/\d{2}$/).withMessage('Expiry must be MM/YY'),
  body('cvv').trim().matches(/^\d{3,4}$/).withMessage('CVV must be 3 or 4 digits'),
];
