import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare const getUserProfile: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateUserProfile: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateEntrepreneurProfile: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateInvestorProfile: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getAllEntrepreneurs: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getAllInvestors: (req: AuthenticatedRequest, res: Response) => Promise<void>;
