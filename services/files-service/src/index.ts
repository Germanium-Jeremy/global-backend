import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import fileRoutes from './routes/file.routes.js';
import { logger } from 'shared';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3003;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/GlobalBackend_files';

app.use('/', fileRoutes);

mongoose.connect(MONGO_URI)
  .then(() => {
    logger.info('Connected to MongoDB: GlobalBackend_files');
    app.listen(PORT, () => {
      logger.info(`Files service is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('MongoDB connection error', err);
  });
