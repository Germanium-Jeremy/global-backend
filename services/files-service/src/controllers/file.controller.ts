import { Request, Response } from 'express';
import File from '../models/file.model.js';
import { logger } from 'shared';

// POST / — create a new file for the authenticated user
export const createFile = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.sub;
    const { fileName, content = '' } = req.body;

    if (!fileName || !fileName.trim()) {
      return res.status(400).json({ message: 'fileName is required' });
    }

    const file = new File({ userId, fileName: fileName.trim(), content });
    await file.save();

    logger.info(`File created: "${fileName}" for user ${userId}`);
    res.status(201).json(file);
  } catch (error: any) {
    logger.error('createFile error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET / — list all files for the authenticated user
export const listFiles = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.sub;
    const files = await File.find({ userId }).sort({ updatedAt: -1 }).select('-__v');

    res.json(files);
  } catch (error: any) {
    logger.error('listFiles error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /:id — get a single file (ownership enforced)
export const getFile = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.sub;
    const file = await File.findOne({ _id: req.params.id, userId }).select('-__v');

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.json(file);
  } catch (error: any) {
    logger.error('getFile error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /:id — update fileName and/or content (ownership enforced)
export const updateFile = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.sub;
    const { fileName, content } = req.body;

    const update: Partial<{ fileName: string; content: string }> = {};
    if (fileName !== undefined) update.fileName = fileName.trim();
    if (content  !== undefined) update.content  = content;

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    const file = await File.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $set: update },
      { new: true }
    ).select('-__v');

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    logger.info(`File updated: ${req.params.id} for user ${userId}`);
    res.json(file);
  } catch (error: any) {
    logger.error('updateFile error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /:id — delete a file (ownership enforced)
export const deleteFile = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.sub;
    const file = await File.findOneAndDelete({ _id: req.params.id, userId });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    logger.info(`File deleted: ${req.params.id} for user ${userId}`);
    res.json({ message: 'File deleted successfully' });
  } catch (error: any) {
    logger.error('deleteFile error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /:id/share — mark a file as shared (ownership enforced)
export const shareFile = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.sub;
    const file = await File.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $set: { isShared: true } },
      { new: true }
    ).select('-__v');

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    logger.info(`File shared: ${req.params.id} by user ${userId}`);
    res.json(file);
  } catch (error: any) {
    logger.error('shareFile error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /shared/:id — get a shared file
export const getSharedFile = async (req: Request, res: Response) => {
  try {
    const file = await File.findOne({ _id: req.params.id, isShared: true }).select('-__v');

    if (!file) {
      return res.status(404).json({ message: 'Shared file not found' });
    }

    res.json(file);
  } catch (error: any) {
    logger.error('getSharedFile error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /shared/:id/fork — fork a shared file for the current user
export const forkFile = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.sub;
    
    // Find the shared file
    const fileToFork = await File.findOne({ _id: req.params.id, isShared: true });
    
    if (!fileToFork) {
      return res.status(404).json({ message: 'Shared file not found' });
    }

    // Restriction: Users cannot fork their own files
    if (fileToFork.userId === userId) {
      return res.status(400).json({ message: 'You cannot fork your own file' });
    }

    // Create the new file for the current user
    const forkedFile = new File({
      userId,
      fileName: fileToFork.fileName,
      content: fileToFork.content,
      isShared: false // Forked files are private by default
    });

    await forkedFile.save();

    logger.info(`File ${req.params.id} forked as ${forkedFile._id} for user ${userId}`);
    res.status(201).json(forkedFile);
  } catch (error: any) {
    logger.error('forkFile error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
