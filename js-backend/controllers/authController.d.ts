import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare const register: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const login: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const logout: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const refreshAccessToken: (req: AuthenticatedRequest, res: Response) => Promise<void>;
