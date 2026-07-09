import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js';
import { logger } from 'shared';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/GlobalBackend_auth';

app.use('/', authRoutes);

mongoose.connect(MONGO_URI)
  .then(() => {
    logger.info('Connected to MongoDB: GlobalBackend_auth');
    app.listen(PORT, () => {
      logger.info(`Auth service is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('MongoDB connection error', err);
  });
