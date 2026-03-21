export enum Role {
  Guest = 'guest',
  Admin = 'admin',
  Standard = 'standard',
  Stuff = 'stuff',
}

/**
 * JWT payload shape used across services.
 */
export interface JwtPayload {
  sub: string;          // user id
  email: string;
  role: Role;
  iat?: number;          // issued at (seconds since epoch)
  exp?: number;          // expiration (seconds since epoch)
}

/**
 * User model shape stored in MongoDB.
 */
export interface User {
  _id: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: Date;
  // Optional profile fields — not required, populated when provided
  username?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

export interface OutboundMessage {
  userId: string;
  type: 'CHAT' | 'NOTIFICATION' | 'STREAM' | 'SYSTEM';
  payload: any;
  timestamp: string;
}
