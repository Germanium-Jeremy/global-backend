import { Request, Response } from 'express';
import axios from 'axios';
import CustomInstruction from '../models/custom-instruction.model.js';
import Chat from '../models/chat.model.js';
import { logger } from 'shared';

const OLLAMA_API = 'http://localhost:11434/api/chat';
const DEFAULT_MODEL = 'llama3.2:3b';
const SUPPORTED_MODELS = ['llama3.2:3b', 'qwen2.5:3b', 'phi3:mini'];

export class AiController {
  async getInstructions(req: Request, res: Response) {
    try {
      const userId = req.user?.sub;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });

      const instructions = await CustomInstruction.findOne({ userId });
      res.json(instructions || { systemPrompt: 'You are a helpful assistant.' });
    } catch (err) {
      logger.error('Error fetching instructions', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updateInstructions(req: Request, res: Response) {
    try {
      const userId = req.user?.sub;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });

      const { systemPrompt } = req.body;
      if (!systemPrompt) return res.status(400).json({ message: 'systemPrompt is required' });

      const instructions = await CustomInstruction.findOneAndUpdate(
        { userId },
        { systemPrompt },
        { upsert: true, new: true }
      );
      res.json(instructions);
    } catch (err) {
      logger.error('Error updating instructions', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async chat(req: Request, res: Response) {
    try {
      const userId = req.user?.sub;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });

      const { prompt, model = DEFAULT_MODEL } = req.body;
      if (!prompt) return res.status(400).json({ message: 'prompt is required' });
      if (!SUPPORTED_MODELS.includes(model)) {
        return res.status(400).json({ message: `Unsupported model. Supported: ${SUPPORTED_MODELS.join(', ')}` });
      }

      const instructions = await CustomInstruction.findOne({ userId });
      const systemPrompt = instructions?.systemPrompt || 'You are a helpful assistant.';

      const response = await axios.post(OLLAMA_API, {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        stream: false,
      });

      res.json(response.data);
    } catch (err: any) {
      logger.error('Error in AI chat', err);
      res.status(err.response?.status || 500).json({
        message: err.response?.data?.error || 'Internal server error'
      });
    }
  }

  async chatStream(req: Request, res: Response) {
    try {
      const userId = req.user?.sub;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });

      const { prompt, model = DEFAULT_MODEL } = req.body;
      if (!prompt) return res.status(400).json({ message: 'prompt is required' });
      if (!SUPPORTED_MODELS.includes(model)) {
        return res.status(400).json({ message: `Unsupported model. Supported: ${SUPPORTED_MODELS.join(', ')}` });
      }

      const instructions = await CustomInstruction.findOne({ userId });
      const systemPrompt = instructions?.systemPrompt || 'You are a helpful assistant.';

      const response = await axios.post(OLLAMA_API, {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        stream: true,
      }, { responseType: 'stream' });

      res.setHeader('Content-Type', 'text/plain');
      response.data.pipe(res);

    } catch (err: any) {
      logger.error('Error in AI chat stream', err);
      if (!res.headersSent) {
        res.status(err.response?.status || 500).json({
          message: err.response?.data?.error || 'Internal server error'
        });
      }
    }
  }

  async createChat(req: Request, res: Response) {
    try {
      const userId = req.user?.sub;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });

      const { title } = req.body;
      const chat = await Chat.create({ userId, title: title || 'New Chat' });
      res.status(201).json(chat);
    } catch (err) {
      logger.error('Error creating chat', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async listChats(req: Request, res: Response) {
    try {
      const userId = req.user?.sub;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });

      const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
      res.json(chats);
    } catch (err) {
      logger.error('Error listing chats', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getChat(req: Request, res: Response) {
    try {
      const userId = req.user?.sub;
      const { id } = req.params;

      const chat = await Chat.findOne({ _id: id, userId });
      if (!chat) return res.status(404).json({ message: 'Chat not found' });

      res.json(chat);
    } catch (err) {
      logger.error('Error getting chat', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async sendChatMessage(req: Request, res: Response) {
    try {
      const userId = req.user?.sub;
      const { id } = req.params;
      const { content, model = DEFAULT_MODEL } = req.body;

      if (!content) return res.status(400).json({ message: 'content is required' });

      const chat = await Chat.findOne({ _id: id, userId });
      if (!chat) return res.status(404).json({ message: 'Chat not found' });

      // Append user message
      chat.messages.push({ role: 'user', content, createdAt: new Date() });

      const instructions = await CustomInstruction.findOne({ userId });
      const systemPrompt = instructions?.systemPrompt || 'You are a helpful assistant.';

      // Prepare messages for Ollama
      const ollamaMessages = [
        { role: 'system', content: systemPrompt },
        ...chat.messages.map(m => ({ role: m.role, content: m.content }))
      ];

      const response = await axios.post(OLLAMA_API, {
        model,
        messages: ollamaMessages,
        stream: false,
      });

      const aiContent = response.data.message.content;

      // Append AI response
      chat.messages.push({ role: 'assistant', content: aiContent, createdAt: new Date() });
      await chat.save();

      res.json({ message: aiContent });
    } catch (err: any) {
      logger.error('Error sending chat message', err);
      res.status(err.response?.status || 500).json({
        message: err.response?.data?.error || 'Internal server error'
      });
    }
  }
}
