import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  createFile,
  listFiles,
  getFile,
  updateFile,
  deleteFile,
} from '../controllers/file.controller.js';

const router = Router();

// All file routes require a valid JWT
router.use(authMiddleware);

router.post('/',       createFile);
router.get('/',        listFiles);
router.get('/:id',     getFile);
router.put('/:id',     updateFile);
router.delete('/:id',  deleteFile);

export default router;
