import { Response } from 'express';
import { validationResult } from 'express-validator';
import { User } from '../models/User';
import { EntrepreneurProfile } from '../models/EntrepreneurProfile';
import { InvestorProfile } from '../models/InvestorProfile';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AuthenticatedRequest } from '../middleware/auth';

export const register = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array(),
      });
      return;
    }

    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'User already registered with this email',
      });
      return;
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=random`,
      isOnline: true,
    });

    await user.save();

    // Create role-specific profile
    if (role === 'entrepreneur') {
      const entrepreneurProfile = new EntrepreneurProfile({
        userId: user._id,
        startupName: '',
        pitchSummary: '',
        fundingNeeded: '',
        industry: '',
        location: '',
        foundedYear: new Date().getFullYear(),
        teamSize: 1,
      });
      await entrepreneurProfile.save();
    } else if (role === 'investor') {
      const investorProfile = new InvestorProfile({
        userId: user._id,
        investmentInterests: [],
        investmentStage: [],
        portfolioCompanies: [],
        totalInvestments: 0,
        minimumInvestment: '',
        maximumInvestment: '',
      });
      await investorProfile.save();
    }

    // Generate tokens
    const token = generateToken(user._id.toString(), role);
    const refreshToken = generateRefreshToken(user._id.toString());

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
          bio: user.bio,
          isOnline: user.isOnline,
          createdAt: user.createdAt,
        },
        token,
        refreshToken,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message,
    });
  }
};

export const login = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array(),
      });
      return;
    }

    const { email, password, role } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email, role }).select('+password');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email, password, or role',
      });
      return;
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid email, password, or role',
      });
      return;
    }

    // Update online status
    user.isOnline = true;
    await user.save();

    // Generate tokens
    const token = generateToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
          bio: user.bio,
          isOnline: user.isOnline,
          createdAt: user.createdAt,
        },
        token,
        refreshToken,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
};

export const logout = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    // Update online status
    const user = await User.findById(req.user.userId);
    if (user) {
      user.isOnline = false;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error during logout',
      error: error.message,
    });
  }
};

export const refreshAccessToken = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
      return;
    }

    // Verify refresh token and extract user id
    const decoded = verifyRefreshToken(refreshToken) as { userId?: string };
    if (!decoded?.userId) {
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
      return;
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
      return;
    }

    // Generate new access token
    const newAccessToken = generateToken(
      user._id.toString(),
      user.role
    );

    res.status(200).json({
      success: true,
      message: 'New access token generated',
      data: {
        token: newAccessToken,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error during token refresh',
      error: error.message,
    });
  }
};
