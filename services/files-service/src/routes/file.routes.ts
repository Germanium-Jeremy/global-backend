import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
  createFile,
  listFiles,
  getFile,
  updateFile,
  deleteFile,
  shareFile,
  getSharedFile,
  forkFile,
} from '../controllers/file.controller.js';

const router = Router();

// All file routes require a valid JWT
router.use(authMiddleware);

router.post('/',       createFile);
router.get('/',        listFiles);
router.get('/shared/:id', getSharedFile);
router.post('/shared/:id/fork', forkFile);
router.get('/:id',     getFile);
router.put('/:id',     updateFile);
router.put('/:id/share', shareFile);
router.delete('/:id',  deleteFile);

export default router;
