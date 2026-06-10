export enum Role {
  Customer = 'customer',
  Admin = 'admin',
  Casual = 'casual',
}

/**
 * JWT payload shape used across services.
 */
export interface JwtPayload {
  sub: string;          // user id
  email: string;
  role: Role;
  iat: number;          // issued at (seconds since epoch)
  exp: number;          // expiration (seconds since epoch)
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
}
