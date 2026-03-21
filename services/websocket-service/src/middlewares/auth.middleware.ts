import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';

export const authMiddleware = (socket: Socket, next: (err?: any) => void) => {
  const token = socket.handshake.auth.token || socket.handshake.query.token;

  if (!token) {
    return next(new Error('Authentication token is missing'));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string };
    if (!decoded.sub) {
      return next(new Error('Invalid token payload'));
    }

    // Attach userId to the socket for use in ConnectionManager
    (socket as any).userId = decoded.sub;
    next();
  } catch (err) {
    return next(new Error('Invalid or expired token'));
  }
};
