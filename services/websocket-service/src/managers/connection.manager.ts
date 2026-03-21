import { Server, Socket } from 'socket.io';

export class ConnectionManager {
  private static instance: ConnectionManager;
  private connections: Map<string, Socket> = new Map();

  private constructor() {}

  public static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }

  public addConnection(userId: string, socket: Socket): void {
    const existingSocket = this.connections.get(userId);
    if (existingSocket) {
      console.log(`Replacing existing connection for user: ${userId}`);
      existingSocket.disconnect(true);
    }
    this.connections.set(userId, socket);
    console.log(`User ${userId} connected. Total connections: ${this.connections.size}`);
  }

  public removeConnection(userId: string): void {
    this.connections.delete(userId);
    console.log(`User ${userId} disconnected. Total connections: ${this.connections.size}`);
  }

  public getSocket(userId: string): Socket | undefined {
    return this.connections.get(userId);
  }

  public getAllConnections(): Map<string, Socket> {
    return this.connections;
  }
}
