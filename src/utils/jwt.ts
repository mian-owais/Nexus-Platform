import jwt from 'jsonwebtoken';

interface IPayload {
  userId: string;
  role: 'entrepreneur' | 'investor';
}

export const generateToken = (
  userId: string,
  role: 'entrepreneur' | 'investor'
): string => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'your_secret_key',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || 'refresh_secret_key',
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
    }
  );
};

export const verifyToken = (token: string): IPayload => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your_secret_key'
    ) as IPayload;
    return decoded;
  } catch (error: any) {
    throw new Error('Invalid token');
  }
};

export const verifyRefreshToken = (token: string): any => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || 'refresh_secret_key'
    );
    return decoded;
  } catch (error: any) {
    throw new Error('Invalid refresh token');
  }
};

export const decodeToken = (token: string): IPayload | null => {
  try {
    return jwt.decode(token) as IPayload;
  } catch (error) {
    return null;
  }
};
