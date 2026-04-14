import jwt, { Secret, SignOptions, JwtPayload } from 'jsonwebtoken';

interface IPayload {
  userId: string;
  role: 'entrepreneur' | 'investor';
}

const getJwtSecret = (): string => {
  return process.env.JWT_SECRET || 'your_secret_key';
};

const getRefreshSecret = (): string => {
  return process.env.JWT_REFRESH_SECRET || 'refresh_secret_key';
};

export const generateToken = (
  userId: string,
  role: 'entrepreneur' | 'investor'
): string => {
  const options: SignOptions & { expiresIn: string | number } = {
    expiresIn: (process.env.JWT_EXPIRE || '7d') as string,
  };
  return jwt.sign(
    { userId, role },
    getJwtSecret(),
    options as SignOptions
  );
};

export const generateRefreshToken = (userId: string): string => {
  const options: SignOptions & { expiresIn: string | number } = {
    expiresIn: (process.env.JWT_REFRESH_EXPIRE || '30d') as string,
  };
  return jwt.sign(
    { userId },
    getRefreshSecret(),
    options as SignOptions
  );
};

export const verifyToken = (token: string): IPayload => {
  try {
    const decoded = jwt.verify(
      token,
      getJwtSecret()
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
      getRefreshSecret()
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
