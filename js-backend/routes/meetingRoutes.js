"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const meetingController_1 = require("../controllers/meetingController");
const router = (0, express_1.Router)();
// Schedule meeting validation
const scheduleValidation = [
    (0, express_validator_1.body)('title')
        .trim()
        .notEmpty()
        .withMessage('Meeting title is required')
        .isLength({ max: 200 })
        .withMessage('Title must not exceed 200 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description must not exceed 1000 characters'),
    (0, express_validator_1.body)('participantIds')
        .isArray({ min: 1 })
        .withMessage('At least one participant is required')
        .custom((value) => {
        if (!Array.isArray(value))
            return false;
        return value.every(id => /^[a-f\d]{24}$/i.test(id));
    })
        .withMessage('Valid participant IDs are required'),
    (0, express_validator_1.body)('startTime')
        .isISO8601()
        .withMessage('Valid start time is required')
        .custom((value) => {
        const startTime = new Date(value);
        if (startTime <= new Date()) {
            throw new Error('Start time must be in the future');
        }
        return true;
    }),
    (0, express_validator_1.body)('endTime')
        .isISO8601()
        .withMessage('Valid end time is required')
        .custom((value, { req }) => {
        const endTime = new Date(value);
        const startTime = new Date(req.body.startTime);
        if (endTime <= startTime) {
            throw new Error('End time must be after start time');
        }
        return true;
    }),
    (0, express_validator_1.body)('location')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Location must not exceed 200 characters'),
    (0, express_validator_1.body)('meetingLink')
        .optional()
        .trim()
        .matches(/^https?:\/\/.+/)
        .withMessage('Valid meeting link URL is required'),
    (0, express_validator_1.body)('meetingType')
        .optional()
        .isIn(['one-on-one', 'group', 'webinar'])
        .withMessage('Invalid meeting type'),
];
// Update meeting validation
const updateValidation = [
    (0, express_validator_1.body)('title')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Title cannot be empty')
        .isLength({ max: 200 })
        .withMessage('Title must not exceed 200 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description must not exceed 1000 characters'),
    (0, express_validator_1.body)('location')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Location must not exceed 200 characters'),
    (0, express_validator_1.body)('meetingLink')
        .optional()
        .trim()
        .matches(/^https?:\/\/.+/)
        .withMessage('Valid meeting link URL is required'),
    (0, express_validator_1.body)('meetingType')
        .optional()
        .isIn(['one-on-one', 'group', 'webinar'])
        .withMessage('Invalid meeting type'),
];
/**
 * @route   POST /api/meetings/schedule
 * @desc    Schedule a new meeting
 * @access  Private
 */
router.post('/schedule', auth_1.authenticate, scheduleValidation, meetingController_1.scheduleMeeting);
/**
 * @route   GET /api/meetings
 * @desc    Get all meetings for current user
 * @access  Private
 */
router.get('/', auth_1.authenticate, meetingController_1.getUserMeetings);
/**
 * @route   GET /api/meetings/:meetingId
 * @desc    Get a specific meeting
 * @access  Private
 */
router.get('/:meetingId', auth_1.authenticate, meetingController_1.getMeetingById);
/**
 * @route   POST /api/meetings/:meetingId/accept
 * @desc    Accept a meeting invitation
 * @access  Private
 */
router.post('/:meetingId/accept', auth_1.authenticate, meetingController_1.acceptMeeting);
/**
 * @route   POST /api/meetings/:meetingId/decline
 * @desc    Decline a meeting invitation
 * @access  Private
 */
router.post('/:meetingId/decline', auth_1.authenticate, meetingController_1.declineMeeting);
/**
 * @route   PUT /api/meetings/:meetingId
 * @desc    Update a meeting (organizer only)
 * @access  Private
 */
router.put('/:meetingId', auth_1.authenticate, updateValidation, meetingController_1.updateMeeting);
/**
 * @route   POST /api/meetings/:meetingId/cancel
 * @desc    Cancel a meeting (organizer only)
 * @access  Private
 */
router.post('/:meetingId/cancel', auth_1.authenticate, meetingController_1.cancelMeeting);
/**
 * @route   POST /api/meetings/:meetingId/complete
 * @desc    Mark meeting as completed (organizer only)
 * @access  Private
 */
router.post('/:meetingId/complete', auth_1.authenticate, meetingController_1.completeMeeting);
/**
 * @route   GET /api/meetings/availability/:userId
 * @desc    Get available time slots for a user
 * @access  Private
 */
router.get('/availability/:userId', auth_1.authenticate, meetingController_1.getAvailableSlots);
exports.default = router;
