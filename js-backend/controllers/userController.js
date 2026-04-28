"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllInvestors = exports.getAllEntrepreneurs = exports.updateInvestorProfile = exports.updateEntrepreneurProfile = exports.updateUserProfile = exports.getUserProfile = void 0;
const express_validator_1 = require("express-validator");
const User_1 = require("../models/User");
const EntrepreneurProfile_1 = require("../models/EntrepreneurProfile");
const InvestorProfile_1 = require("../models/InvestorProfile");
// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User_1.User.findById(userId);
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
            profile = await EntrepreneurProfile_1.EntrepreneurProfile.findOne({ userId });
        }
        else if (user.role === 'investor') {
            profile = await InvestorProfile_1.InvestorProfile.findOne({ userId });
        }
        res.status(200).json({
            success: true,
            data: {
                user: user.toJSON(),
                profile,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching user profile',
            error: error.message,
        });
    }
};
exports.getUserProfile = getUserProfile;
// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
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
        const user = await User_1.User.findByIdAndUpdate(userId, { name, bio, avatarUrl }, { new: true, runValidators: true });
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error updating profile',
            error: error.message,
        });
    }
};
exports.updateUserProfile = updateUserProfile;
// Update entrepreneur profile
const updateEntrepreneurProfile = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errors.array(),
            });
            return;
        }
        const { entrepreneurId } = req.params;
        const { startupName, pitchSummary, fundingNeeded, industry, location, foundedYear, teamSize } = req.body;
        // Verify user is updating their own profile
        const profile = await EntrepreneurProfile_1.EntrepreneurProfile.findById(entrepreneurId);
        if (!profile || profile.userId.toString() !== req.user?.userId) {
            res.status(403).json({
                success: false,
                message: 'Not authorized to update this profile',
            });
            return;
        }
        const updatedProfile = await EntrepreneurProfile_1.EntrepreneurProfile.findByIdAndUpdate(entrepreneurId, {
            startupName,
            pitchSummary,
            fundingNeeded,
            industry,
            location,
            foundedYear,
            teamSize,
        }, { new: true, runValidators: true });
        res.status(200).json({
            success: true,
            message: 'Entrepreneur profile updated',
            data: { profile: updatedProfile },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error updating entrepreneur profile',
            error: error.message,
        });
    }
};
exports.updateEntrepreneurProfile = updateEntrepreneurProfile;
// Update investor profile
const updateInvestorProfile = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errors.array(),
            });
            return;
        }
        const { investorId } = req.params;
        const { investmentInterests, investmentStage, minimumInvestment, maximumInvestment, yearsOfExperience, company, } = req.body;
        // Verify user is updating their own profile
        const profile = await InvestorProfile_1.InvestorProfile.findById(investorId);
        if (!profile || profile.userId.toString() !== req.user?.userId) {
            res.status(403).json({
                success: false,
                message: 'Not authorized to update this profile',
            });
            return;
        }
        const updatedProfile = await InvestorProfile_1.InvestorProfile.findByIdAndUpdate(investorId, {
            investmentInterests,
            investmentStage,
            minimumInvestment,
            maximumInvestment,
            yearsOfExperience,
            company,
        }, { new: true, runValidators: true });
        res.status(200).json({
            success: true,
            message: 'Investor profile updated',
            data: { profile: updatedProfile },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error updating investor profile',
            error: error.message,
        });
    }
};
exports.updateInvestorProfile = updateInvestorProfile;
// Get all entrepreneurs with filtering
const getAllEntrepreneurs = async (req, res) => {
    try {
        const { search, industry, location, page = 1, limit = 20 } = req.query;
        let query = { role: 'entrepreneur' };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { bio: { $regex: search, $options: 'i' } },
            ];
        }
        const skip = ((Number(page) - 1) * Number(limit)) || 0;
        const total = await User_1.User.countDocuments(query);
        const entrepreneurs = await User_1.User.find(query)
            .skip(skip)
            .limit(Number(limit))
            .lean();
        // Get entrepreneur profiles
        const entrepreneursWithProfiles = await Promise.all(entrepreneurs.map(async (entrepreneur) => {
            const profile = await EntrepreneurProfile_1.EntrepreneurProfile.findOne({
                userId: entrepreneur._id,
            }).lean();
            return {
                ...entrepreneur,
                profile,
            };
        }));
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching entrepreneurs',
            error: error.message,
        });
    }
};
exports.getAllEntrepreneurs = getAllEntrepreneurs;
// Get all investors with filtering
const getAllInvestors = async (req, res) => {
    try {
        const { search, stage, interests, page = 1, limit = 20 } = req.query;
        let query = { role: 'investor' };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { bio: { $regex: search, $options: 'i' } },
            ];
        }
        const skip = ((Number(page) - 1) * Number(limit)) || 0;
        const total = await User_1.User.countDocuments(query);
        const investors = await User_1.User.find(query)
            .skip(skip)
            .limit(Number(limit))
            .lean();
        // Get investor profiles with filtering
        let investorsWithProfiles = await Promise.all(investors.map(async (investor) => {
            const profile = await InvestorProfile_1.InvestorProfile.findOne({
                userId: investor._id,
            }).lean();
            return {
                ...investor,
                profile,
            };
        }));
        // Apply profile-based filters if needed
        if (stage || interests) {
            investorsWithProfiles = investorsWithProfiles.filter((inv) => {
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching investors',
            error: error.message,
        });
    }
};
exports.getAllInvestors = getAllInvestors;
