import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { Role, JwtPayload, logger } from 'shared';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role, username, firstName, lastName, avatarUrl } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      passwordHash,
      role: role || Role.Guest,
      // Optional profile fields — only set when provided
      ...(username   && { username }),
      ...(firstName  && { firstName }),
      ...(lastName   && { lastName }),
      ...(avatarUrl  && { avatarUrl }),
    });

    await newUser.save();
    logger.info(`New user registered: ${email}`);

    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (error: any) {
    logger.error('Registration error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Login failed: User not found for email ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      logger.warn(`Login failed: Password mismatch for email ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    logger.info(`User logged in: ${email}`);

    res.json({
      token,
      userId: user._id,
      email: user.email,
      role: user.role,
      // Return optional profile fields when present
      username: user.username ?? null,
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
      avatarUrl: user.avatarUrl ?? null,
    });
  } catch (error: any) {
    logger.error('Login error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
