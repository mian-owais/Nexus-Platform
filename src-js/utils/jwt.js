import jwt from 'jsonwebtoken';
const getJwtSecret = () => {
    return process.env.JWT_SECRET || 'your_secret_key';
};
const getRefreshSecret = () => {
    return process.env.JWT_REFRESH_SECRET || 'refresh_secret_key';
};
export const generateToken = (userId, role) => {
    return jwt.sign({ userId, role }, getJwtSecret(), {
        expiresIn: (process.env.JWT_EXPIRE || '7d'),
    });
};
export const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, getRefreshSecret(), {
        expiresIn: (process.env.JWT_REFRESH_EXPIRE || '30d'),
    });
};
export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, getJwtSecret());
        return decoded;
    }
    catch (error) {
        throw new Error('Invalid token');
    }
};
export const verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(token, getRefreshSecret());
        return decoded;
    }
    catch (error) {
        throw new Error('Invalid refresh token');
    }
};
export const decodeToken = (token) => {
    try {
        return jwt.decode(token);
    }
    catch (error) {
        return null;
    }
};
