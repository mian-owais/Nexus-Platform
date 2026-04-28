"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
// Update user validation rules
const updateUserValidation = [
    (0, express_validator_1.body)('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    (0, express_validator_1.body)('bio')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Bio must not exceed 500 characters'),
];
// Update entrepreneur profile validation
const updateEntrepreneurValidation = [
    (0, express_validator_1.body)('startupName')
        .notEmpty()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Startup name is required and max 100 characters'),
    (0, express_validator_1.body)('pitchSummary')
        .notEmpty()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Pitch summary is required and max 1000 characters'),
    (0, express_validator_1.body)('fundingNeeded')
        .notEmpty()
        .trim()
        .withMessage('Funding needed is required'),
    (0, express_validator_1.body)('industry')
        .notEmpty()
        .trim()
        .withMessage('Industry is required'),
    (0, express_validator_1.body)('location')
        .notEmpty()
        .trim()
        .withMessage('Location is required'),
    (0, express_validator_1.body)('foundedYear')
        .isInt({ min: 1900, max: new Date().getFullYear() })
        .withMessage('Founded year must be valid'),
    (0, express_validator_1.body)('teamSize')
        .isInt({ min: 1 })
        .withMessage('Team size must be at least 1'),
];
// Update investor profile validation
const updateInvestorValidation = [
    (0, express_validator_1.body)('investmentInterests')
        .isArray({ min: 1 })
        .withMessage('At least one investment interest is required'),
    (0, express_validator_1.body)('investmentStage')
        .isArray({ min: 1 })
        .withMessage('At least one investment stage is required'),
    (0, express_validator_1.body)('minimumInvestment')
        .notEmpty()
        .trim()
        .withMessage('Minimum investment is required'),
    (0, express_validator_1.body)('maximumInvestment')
        .notEmpty()
        .trim()
        .withMessage('Maximum investment is required'),
];
/**
 * @route   PUT /api/profile/entrepreneur/:entrepreneurId
 * @desc    Update entrepreneur profile
 * @access  Private
 */
router.put('/profile/entrepreneur/:entrepreneurId', auth_1.authenticate, updateEntrepreneurValidation, userController_1.updateEntrepreneurProfile);
/**
 * @route   PUT /api/profile/investor/:investorId
 * @desc    Update investor profile
 * @access  Private
 */
router.put('/profile/investor/:investorId', auth_1.authenticate, updateInvestorValidation, userController_1.updateInvestorProfile);
/**
 * @route   GET /api/entrepreneurs
 * @desc    Get all entrepreneurs with filtering
 * @access  Private
 */
router.get('/list/entrepreneurs', auth_1.authenticate, userController_1.getAllEntrepreneurs);
/**
 * @route   GET /api/investors
 * @desc    Get all investors with filtering
 * @access  Private
 */
router.get('/list/investors', auth_1.authenticate, userController_1.getAllInvestors);
/**
 * @route   GET /api/users/:userId
 * @desc    Get user profile with role-specific data
 * @access  Private
 */
router.get('/:userId', auth_1.authenticate, userController_1.getUserProfile);
/**
 * @route   PUT /api/users/:userId
 * @desc    Update user general profile
 * @access  Private
 */
router.put('/:userId', auth_1.authenticate, updateUserValidation, userController_1.updateUserProfile);
exports.default = router;
