import express from 'express';
import mongoose from 'mongoose';
import testRoutes from './routes/test.routes.js';
import { logger } from 'shared';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/GlobalBackend_test';

app.use('/', testRoutes);

mongoose.connect(MONGO_URI)
  .then(() => {
    logger.info('Connected to MongoDB: GlobalBackend_test');
    app.listen(PORT, () => {
      logger.info(`Testing service is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('MongoDB connection error', err);
  });
