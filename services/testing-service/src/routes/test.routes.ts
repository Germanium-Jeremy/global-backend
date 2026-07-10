import { Router } from 'express';
import { 
  publicEndpoint, 
  authenticatedEndpoint, 
  adminOnlyEndpoint, 
  staffAndAdminEndpoint 
} from '../controllers/test.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { Role } from 'shared';

const router = Router();

// Unauthenticated (Public)
router.get('/public', publicEndpoint);

// Authenticated (Any valid user)
router.get('/authenticated', authenticate, authenticatedEndpoint);

// Role-based authorization
router.get('/admin', authenticate, authorize([Role.Admin]), adminOnlyEndpoint);
router.get('/staff-or-admin', authenticate, authorize([Role.Admin, Role.Stuff]), staffAndAdminEndpoint);

export default router;
