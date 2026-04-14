import { authenticate, authorize } from '../middleware/auth';
import * as jwt from '../utils/jwt';
import { Request, Response, NextFunction } from 'express';

jest.mock('../../utils/jwt.js');

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

describe('Auth Middleware', () => {
  let mockReq: Partial<Request> & { user?: { userId: string; role: string } };
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  describe('authenticate middleware', () => {
    const testUserId = '507f1f77bcf86cd799439011';
    const testRole = 'entrepreneur';

    it('should pass authentication with valid token in Authorization header', () => {
      const validToken = 'Bearer valid.jwt.token';
      mockReq.headers = { authorization: validToken };

      (jwt.verifyToken as jest.Mock).mockReturnValue({
        userId: testUserId,
        role: testRole,
      });

      authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toEqual({
        userId: testUserId,
        role: testRole,
      });
    });

    it('should fail authentication when no Authorization header', () => {
      mockReq.headers = {};

      authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('token'),
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail authentication when Authorization header does not start with Bearer', () => {
      mockReq.headers = { authorization: 'Basic invalid' };

      authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail authentication with invalid token', () => {
      const invalidToken = 'Bearer invalid.jwt.token';
      mockReq.headers = { authorization: invalidToken };

      (jwt.verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail authentication with expired token', () => {
      const expiredToken = 'Bearer expired.jwt.token';
      mockReq.headers = { authorization: expiredToken };

      const error = new Error('Token expired');
      (error as any).name = 'TokenExpiredError';
      (jwt.verifyToken as jest.Mock).mockImplementation(() => {
        throw error;
      });

      authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should extract token from Bearer header correctly', () => {
      const validToken = 'Bearer valid.jwt.token';
      mockReq.headers = { authorization: validToken };

      (jwt.verifyToken as jest.Mock).mockReturnValue({
        userId: testUserId,
        role: testRole,
      });

      authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(jwt.verifyToken).toHaveBeenCalledWith('valid.jwt.token');
    });

    it('should attach decoded user to request object', () => {
      const validToken = 'Bearer valid.jwt.token';
      mockReq.headers = { authorization: validToken };

      const decodedUser = {
        userId: testUserId,
        role: testRole,
      };

      (jwt.verifyToken as jest.Mock).mockReturnValue(decodedUser);

      authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.user).toEqual(decodedUser);
    });
  });

  describe('authorize middleware', () => {
    const testUserId = '507f1f77bcf86cd799439011';

    it('should allow request with valid role', () => {
      mockReq.user = {
        userId: testUserId,
        role: 'entrepreneur',
      };

      const authorizeEntrepreneur = authorize(['entrepreneur', 'investor']);
      authorizeEntrepreneur(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should deny request when user role not in allowed roles', () => {
      mockReq.user = {
        userId: testUserId,
        role: 'entrepreneur',
      };

      const authorizeInvestor = authorize(['investor']);
      authorizeInvestor(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should deny request when user not attached to request', () => {
      mockReq.user = undefined;

      const authorizeAny = authorize(['entrepreneur', 'investor']);
      authorizeAny(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should allow investor role access to investor endpoints', () => {
      mockReq.user = {
        userId: testUserId,
        role: 'investor',
      };

      const authorizeInvestor = authorize(['investor']);
      authorizeInvestor(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should allow multiple roles when specified', () => {
      const entrepreneurs = [
        { role: 'entrepreneur' },
        { role: 'investor' },
        { role: 'admin' },
      ];

      entrepreneurs.forEach(user => {
        mockReq.user = { userId: testUserId, ...user };
        mockNext.mockClear();

        const authorize_func = authorize(['entrepreneur', 'investor', 'admin']);
        authorize_func(mockReq as Request, mockRes as Response, mockNext);

        expect(mockNext).toHaveBeenCalled();
      });
    });

    it('should return 403 status with appropriate message when authorization fails', () => {
      mockReq.user = {
        userId: testUserId,
        role: 'entrepreneur',
      };

      const authorizeInvestor = authorize(['investor']);
      authorizeInvestor(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('permission'),
        })
      );
    });

    it('should work with single role in allowed roles array', () => {
      mockReq.user = {
        userId: testUserId,
        role: 'entrepreneur',
      };

      const authorizeEntrepreneur = authorize(['entrepreneur']);
      authorizeEntrepreneur(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('middleware chaining', () => {
    const testUserId = '507f1f77bcf86cd799439011';

    it('should flow through authenticate then authorize middleware', () => {
      const validToken = 'Bearer valid.jwt.token';
      mockReq.headers = { authorization: validToken };

      (jwt.verifyToken as jest.Mock).mockReturnValue({
        userId: testUserId,
        role: 'entrepreneur',
      });

      // First authenticate
      authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeDefined();

      // Then authorize
      mockNext.mockClear();
      mockRes.status = jest.fn().mockReturnThis();
      mockRes.json = jest.fn().mockReturnThis();

      const authorizeMiddleware = authorize(['entrepreneur', 'investor']);
      authorizeMiddleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should fail at authorize if user lacks permission even with valid token', () => {
      const validToken = 'Bearer valid.jwt.token';
      mockReq.headers = { authorization: validToken };

      (jwt.verifyToken as jest.Mock).mockReturnValue({
        userId: testUserId,
        role: 'entrepreneur',
      });

      // First authenticate
      authenticate(mockReq as Request, mockRes as Response, mockNext);
      expect(mockReq.user).toBeDefined();

      // Then authorize fails
      mockNext.mockClear();
      mockRes.status = jest.fn().mockReturnThis();
      mockRes.json = jest.fn().mockReturnThis();

      const authorizeMiddleware = authorize(['investor']);
      authorizeMiddleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
