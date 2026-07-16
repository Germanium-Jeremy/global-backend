import { register, login } from '../auth.controller.js';
import User from '../../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Role } from 'shared';

jest.mock('../../models/user.model.js');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockImplementation((result) => {
    res.body = result;
    return res;
  });
  return res;
};

const mockRequest = (body = {}) => ({
  body,
});

describe('Auth Controller', () => {
  let res: any;

  beforeEach(() => {
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe('register', () => {
    const regBody = {
      email: 'test@example.com',
      password: 'password123',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
    };

    it('should register a new user successfully', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPwd');

      const mockUserInstance = {
        save: jest.fn().mockResolvedValue(true),
        _id: 'mock-id',
      };
      (User as any).mockImplementation(() => mockUserInstance);

      const req = mockRequest(regBody);
      await register(req as any, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'User registered successfully',
      }));
    });

    it('should return 400 if user already exists', async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ email: 'test@example.com' });

      const req = mockRequest(regBody);
      await register(req as any, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });

    it('should return 500 on internal server error', async () => {
      (User.findOne as jest.Mock).mockRejectedValue(new Error('DB Error'));

      const req = mockRequest(regBody);
      await register(req as any, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('login', () => {
    const loginBody = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login successfully', async () => {
      const mockUser = {
        _id: 'mock-id',
        email: 'test@example.com',
        passwordHash: 'hashedPwd',
        role: Role.Standard,
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        avatarUrl: 'avatar.url',
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mock-token');

      const req = mockRequest(loginBody);
      await login(req as any, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        token: 'mock-token',
        email: 'test@example.com',
      }));
    });

    it('should return 400 if user not found', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const req = mockRequest(loginBody);
      await login(req as any, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should return 400 if password mismatch', async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ passwordHash: 'hashed' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const req = mockRequest(loginBody);
      await login(req as any, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should return 500 on internal server error', async () => {
      (User.findOne as jest.Mock).mockRejectedValue(new Error('DB Error'));

      const req = mockRequest(loginBody);
      await login(req as any, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });
});
