import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authenticate';
import { ForbiddenError } from '../utils/errors';
import { UserRole } from '../enums/user-role.enum';

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ForbiddenError('Not authenticated');
    }
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError('Insufficient privileges');
    }
    next();
  };
};