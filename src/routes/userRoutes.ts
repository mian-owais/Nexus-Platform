import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import {
  getUserProfile,
  updateUserProfile,
  updateEntrepreneurProfile,
  updateInvestorProfile,
  getAllEntrepreneurs,
  getAllInvestors,
} from '../controllers/userController';

const router = Router();

// Update user validation rules
const updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must not exceed 500 characters'),
];

// Update entrepreneur profile validation
const updateEntrepreneurValidation = [
  body('startupName')
    .notEmpty()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Startup name is required and max 100 characters'),
  body('pitchSummary')
    .notEmpty()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Pitch summary is required and max 1000 characters'),
  body('fundingNeeded')
    .notEmpty()
    .trim()
    .withMessage('Funding needed is required'),
  body('industry')
    .notEmpty()
    .trim()
    .withMessage('Industry is required'),
  body('location')
    .notEmpty()
    .trim()
    .withMessage('Location is required'),
  body('foundedYear')
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage('Founded year must be valid'),
  body('teamSize')
    .isInt({ min: 1 })
    .withMessage('Team size must be at least 1'),
];

// Update investor profile validation
const updateInvestorValidation = [
  body('investmentInterests')
    .isArray({ min: 1 })
    .withMessage('At least one investment interest is required'),
  body('investmentStage')
    .isArray({ min: 1 })
    .withMessage('At least one investment stage is required'),
  body('minimumInvestment')
    .notEmpty()
    .trim()
    .withMessage('Minimum investment is required'),
  body('maximumInvestment')
    .notEmpty()
    .trim()
    .withMessage('Maximum investment is required'),
];

/**
 * @route   GET /api/users/:userId
 * @desc    Get user profile with role-specific data
 * @access  Private
 */
router.get('/:userId', authenticate, getUserProfile);

/**
 * @route   PUT /api/users/:userId
 * @desc    Update user general profile
 * @access  Private
 */
router.put('/:userId', authenticate, updateUserValidation, updateUserProfile);

/**
 * @route   PUT /api/profile/entrepreneur/:entrepreneurId
 * @desc    Update entrepreneur profile
 * @access  Private
 */
router.put(
  '/profile/entrepreneur/:enterpreneurId',
  authenticate,
  updateEntrepreneurValidation,
  updateEntrepreneurProfile
);

/**
 * @route   PUT /api/profile/investor/:investorId
 * @desc    Update investor profile
 * @access  Private
 */
router.put(
  '/profile/investor/:investorId',
  authenticate,
  updateInvestorValidation,
  updateInvestorProfile
);

/**
 * @route   GET /api/entrepreneurs
 * @desc    Get all entrepreneurs with filtering
 * @access  Private
 */
router.get('/list/entrepreneurs', authenticate, getAllEntrepreneurs);

/**
 * @route   GET /api/investors
 * @desc    Get all investors with filtering
 * @access  Private
 */
router.get('/list/investors', authenticate, getAllInvestors);

export default router;
