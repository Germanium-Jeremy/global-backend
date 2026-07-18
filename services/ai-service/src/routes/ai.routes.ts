import express from 'express';
import { AiController } from '../controllers/ai.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();
const aiController = new AiController();

router.use(authMiddleware);

router.get('/instructions', aiController.getInstructions);
router.put('/instructions', aiController.updateInstructions);

router.post('/chat', aiController.chat);
router.post('/chat/stream', aiController.chatStream);

router.get('/chats', aiController.listChats);
router.post('/chats', aiController.createChat);
router.get('/chats/:id', aiController.getChat);
router.post('/chats/:id/message', aiController.sendChatMessage);

export default router;
