import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export const publicEndpoint = (req: Request, res: Response) => {
  res.json({ message: 'This is a public endpoint accessible by anyone.' });
};

export const authenticatedEndpoint = (req: AuthenticatedRequest, res: Response) => {
  res.json({ 
    message: 'This is an authenticated endpoint.',
    user: req.user
  });
};

export const adminOnlyEndpoint = (req: AuthenticatedRequest, res: Response) => {
  res.json({ 
    message: 'This endpoint is restricted to admins only.',
    user: req.user
  });
};

export const staffAndAdminEndpoint = (req: AuthenticatedRequest, res: Response) => {
  res.json({ 
    message: 'This endpoint is accessible by admins and staff.',
    user: req.user
  });
};
