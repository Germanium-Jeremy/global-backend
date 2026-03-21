import { redisSubscriber } from '../config/redis.config';
import { ConnectionManager } from '../managers/connection.manager';
import { OutboundMessage } from 'shared';

export async function startRedisSubscriber() {
  const connectionManager = ConnectionManager.getInstance();

  try {
    await redisSubscriber.subscribe('ws:outbound', (message) => {
      try {
        const data: OutboundMessage = JSON.parse(message);
        const { userId, type, payload, timestamp } = data;

        const socket = connectionManager.getSocket(userId);
        if (socket) {
          socket.emit('message', {
            type,
            payload,
            timestamp,
          });
          console.log(`Pushed ${type} message to user ${userId}`);
        } else {
          console.log(`User ${userId} not connected, dropping message.`);
        }
      } catch (err) {
        console.error('Error processing Redis message:', err);
      }
    });
    console.log('Redis subscriber started on channel: ws:outbound');
  } catch (err) {
    console.error('Failed to start Redis subscriber:', err);
  }
}
