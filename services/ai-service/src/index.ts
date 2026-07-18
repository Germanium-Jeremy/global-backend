import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import aiRoutes from './routes/ai.routes.js';
import { logger } from 'shared';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3004;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/GlobalBackend_ai';

app.use('/ai', aiRoutes);

mongoose.connect(MONGO_URI)
  .then(() => {
    logger.info('Connected to MongoDB: GlobalBackend_ai');
    app.listen(PORT, () => {
      logger.info(`AI service is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('MongoDB connection error', err);
  });
