import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { connectRedis } from './config/redis.config';
import { ConnectionManager } from './managers/connection.manager';
import { authMiddleware } from './middlewares/auth.middleware';
import { startRedisSubscriber } from './subscribers/redis.subscriber';

dotenv.config();

const PORT = process.env.PORT || 3005;

async function bootstrap() {
  try {
    // Connect to Redis
    await connectRedis();

    // Start Redis Subscriber
    await startRedisSubscriber();

    const app = express();
    const httpServer = createServer(app);
    const io = new Server(httpServer, {
      cors: {
        origin: '*',
      },
    });

    const connectionManager = ConnectionManager.getInstance();

    // Apply authentication middleware
    io.use(authMiddleware);

    io.on('connection', (socket) => {
      const userId = (socket as any).userId;

      connectionManager.addConnection(userId, socket);

      socket.on('disconnect', () => {
        connectionManager.removeConnection(userId);
      });

      // Handle basic heartbeat or client messages if needed
      socket.on('ping', () => socket.emit('pong'));
    });

    app.get('/health', (req, res) => {
      res.json({ status: 'ok', service: 'websocket-service' });
    });

    httpServer.listen(PORT, () => {
      console.log(`WebSocket service running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to bootstrap WebSocket service:', err);
    process.exit(1);
  }
}

bootstrap();
