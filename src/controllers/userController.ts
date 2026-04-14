import { Response } from 'express';
import { validationResult } from 'express-validator';
import { User } from '../models/User';
import { EntrepreneurProfile } from '../models/EntrepreneurProfile';
import { InvestorProfile } from '../models/InvestorProfile';
import { AuthenticatedRequest } from '../middleware/auth';

// Get user profile
export const getUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Get role-specific profile
    let profile = null;
    if (user.role === 'entrepreneur') {
      profile = await EntrepreneurProfile.findOne({ userId });
    } else if (user.role === 'investor') {
      profile = await InvestorProfile.findOne({ userId });
    }

    res.status(200).json({
      success: true,
      data: {
        user: user.toJSON(),
        profile,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching user profile',
      error: error.message,
    });
  }
};

// Update user profile
export const updateUserProfile = async (
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

    const { userId } = req.params;
    const { name, bio, avatarUrl } = req.body;

    // Verify user is updating their own profile
    if (req.user?.userId !== userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile',
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, bio, avatarUrl },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: user.toJSON() },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error updating profile',
      error: error.message,
    });
  }
};

// Update entrepreneur profile
export const updateEntrepreneurProfile = async (
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

    const { enterpreneurId } = req.params;
    const { startupName, pitchSummary, fundingNeeded, industry, location, foundedYear, teamSize } = req.body;

    // Verify user is updating their own profile
    const profile = await EntrepreneurProfile.findById(enterpreneurId);
    if (!profile || profile.userId.toString() !== req.user?.userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile',
      });
      return;
    }

    const updatedProfile = await EntrepreneurProfile.findByIdAndUpdate(
      enterpreneurId,
      {
        startupName,
        pitchSummary,
        fundingNeeded,
        industry,
        location,
        foundedYear,
        teamSize,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Entrepreneur profile updated',
      data: { profile: updatedProfile },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error updating entrepreneur profile',
      error: error.message,
    });
  }
};

// Update investor profile
export const updateInvestorProfile = async (
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

    const { investorId } = req.params;
    const {
      investmentInterests,
      investmentStage,
      minimumInvestment,
      maximumInvestment,
      yearsOfExperience,
      company,
    } = req.body;

    // Verify user is updating their own profile
    const profile = await InvestorProfile.findById(investorId);
    if (!profile || profile.userId.toString() !== req.user?.userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile',
      });
      return;
    }

    const updatedProfile = await InvestorProfile.findByIdAndUpdate(
      investorId,
      {
        investmentInterests,
        investmentStage,
        minimumInvestment,
        maximumInvestment,
        yearsOfExperience,
        company,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Investor profile updated',
      data: { profile: updatedProfile },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error updating investor profile',
      error: error.message,
    });
  }
};

// Get all entrepreneurs with filtering
export const getAllEntrepreneurs = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { search, industry, location, page = 1, limit = 20 } = req.query;

    let query: any = { role: 'entrepreneur' };

    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { bio: { $regex: search as string, $options: 'i' } },
      ];
    }

    const skip = ((Number(page) - 1) * Number(limit)) || 0;

    const total = await User.countDocuments(query);
    const entrepreneurs = await User.find(query)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // Get entrepreneur profiles
    const entrepreneursWithProfiles = await Promise.all(
      entrepreneurs.map(async (entrepreneur: any) => {
        const profile = await EntrepreneurProfile.findOne({
          userId: entrepreneur._id,
        }).lean();
        return {
          ...entrepreneur,
          profile,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: entrepreneursWithProfiles,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalRecords: total,
        limit: Number(limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching entrepreneurs',
      error: error.message,
    });
  }
};

// Get all investors with filtering
export const getAllInvestors = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { search, stage, interests, page = 1, limit = 20 } = req.query;

    let query: any = { role: 'investor' };

    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { bio: { $regex: search as string, $options: 'i' } },
      ];
    }

    const skip = ((Number(page) - 1) * Number(limit)) || 0;

    const total = await User.countDocuments(query);
    const investors = await User.find(query)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // Get investor profiles with filtering
    let investorsWithProfiles = await Promise.all(
      investors.map(async (investor: any) => {
        const profile = await InvestorProfile.findOne({
          userId: investor._id,
        }).lean();
        return {
          ...investor,
          profile,
        };
      })
    );

    // Apply profile-based filters if needed
    if (stage || interests) {
      investorsWithProfiles = investorsWithProfiles.filter((inv: any) => {
        if (stage && !inv.profile?.investmentStage.includes(stage)) {
          return false;
        }
        if (interests && !inv.profile?.investmentInterests.includes(interests)) {
          return false;
        }
        return true;
      });
    }

    res.status(200).json({
      success: true,
      data: investorsWithProfiles,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalRecords: total,
        limit: Number(limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching investors',
      error: error.message,
    });
  }
};
