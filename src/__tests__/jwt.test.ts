import * as jwt from '../utils/jwt';

interface PayloadWithTimestamps {
  userId: string;
  role: 'entrepreneur' | 'investor';
  iat?: number;
  exp?: number;
}
  const testUserId = '507f1f77bcf86cd799439011';
  const testRole = 'entrepreneur' as const;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = jwt.generateToken(testUserId, testRole);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });

    it('should include userId and role in token payload', () => {
      const token = jwt.generateToken(testUserId, testRole);
      const decoded = jwt.decodeToken(token);

      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe(testUserId);
      expect(decoded?.role).toBe(testRole);
    });

    it('should generate different tokens for different inputs', () => {
      const token1 = jwt.generateToken(testUserId, 'entrepreneur');
      const token2 = jwt.generateToken(testUserId, 'investor');

      expect(token1).not.toBe(token2);
    });

    it('should generate different tokens for different user IDs', () => {
      const token1 = jwt.generateToken('user1', testRole);
      const token2 = jwt.generateToken('user2', testRole);

      expect(token1).not.toBe(token2);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const token = jwt.generateRefreshToken(testUserId);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3);
    });

    it('should include userId in refresh token payload', () => {
      const token = jwt.generateRefreshToken(testUserId);
      const decoded = jwt.verifyRefreshToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(testUserId);
    });

    it('should have different token than access token', () => {
      const accessToken = jwt.generateToken(testUserId, testRole);
      const refreshToken = jwt.generateRefreshToken(testUserId);

      expect(accessToken).not.toBe(refreshToken);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const token = jwt.generateToken(testUserId, testRole);
      const decoded = jwt.verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(testUserId);
      expect(decoded.role).toBe(testRole);
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => jwt.verifyToken(invalidToken)).toThrow();
    });

    it('should throw error for tampered token', () => {
      const token = jwt.generateToken(testUserId, testRole);
      const tamperedToken = token.slice(0, -1) + 'x';

      expect(() => jwt.verifyToken(tamperedToken)).toThrow();
    });

    it('should throw error for expired token', async () => {
      // Create a token with very short expiration
      process.env.JWT_EXPIRE = '0s';
      const token = jwt.generateToken(testUserId, testRole);

      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 1100));

      // Reset JWT_EXPIRE
      process.env.JWT_EXPIRE = '7d';

      expect(() => jwt.verifyToken(token)).toThrow();
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a valid refresh token', () => {
      const token = jwt.generateRefreshToken(testUserId);
      const decoded = jwt.verifyRefreshToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(testUserId);
    });

    it('should throw error for invalid refresh token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => jwt.verifyRefreshToken(invalidToken)).toThrow();
    });
  });

  describe('decodeToken', () => {
    it('should decode a valid token without verification', () => {
      const token = jwt.generateToken(testUserId, testRole);
      const decoded = jwt.decodeToken(token);

      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe(testUserId);
      expect(decoded?.role).toBe(testRole);
    });

    it('should return null for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      const decoded = jwt.decodeToken(invalidToken);

      expect(decoded).toBeNull();
    });

    it('should decode token without verifying expiration', async () => {
      process.env.JWT_EXPIRE = '0s';
      const token = jwt.generateToken(testUserId, testRole);
      process.env.JWT_EXPIRE = '7d';

      await new Promise(resolve => setTimeout(resolve, 1100));

      // Should still decode even though expired
      const decoded = jwt.decodeToken(token);
      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe(testUserId);
    });
  });

  describe('Token with different roles', () => {
    it('should correctly encode entrepreneur role', () => {
      const token = jwt.generateToken(testUserId, 'entrepreneur');
      const decoded = jwt.decodeToken(token);

      expect(decoded?.role).toBe('entrepreneur');
    });

    it('should correctly encode investor role', () => {
      const token = jwt.generateToken(testUserId, 'investor');
      const decoded = jwt.decodeToken(token);

      expect(decoded?.role).toBe('investor');
    });
  });

  describe('Token expiration times', () => {
    it('should have iat claim in tokens', () => {
      const token = jwt.generateToken(testUserId, testRole);
      const decoded = jwt.decodeToken(token);

      expect(decoded?.iat).toBeDefined();
      expect(typeof decoded?.iat).toBe('number');
    });

    it('should have exp claim in tokens', () => {
      const token = jwt.generateToken(testUserId, testRole);
      const decoded = jwt.decodeToken(token);

      expect(decoded?.exp).toBeDefined();
      expect(typeof decoded?.exp).toBe('number');
    });

    it('access token should expire after configured time', () => {
      const token = jwt.generateToken(testUserId, testRole);
      const decoded = jwt.decodeToken(token);
      const now = Math.floor(Date.now() / 1000);

      // Token should expire in future (within ~7 days)
      expect(decoded!.exp! > now).toBe(true);
      expect(decoded!.exp! - now).toBeLessThanOrEqual(7 * 24 * 60 * 60);
    });
  });
});
