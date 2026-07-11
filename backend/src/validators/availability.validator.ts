import { body } from 'express-validator';

export const availabilityValidation = [
  body('dayOfWeek').isInt({ min: 0, max: 6 }).withMessage('Day 0-6'),
  body('startTime').matches(/^\d{2}:\d{2}(:\d{2})?$/).withMessage('Invalid start time HH:mm'),
  body('endTime').matches(/^\d{2}:\d{2}(:\d{2})?$/).withMessage('Invalid end time HH:mm'),
];