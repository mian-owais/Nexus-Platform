import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import {
  scheduleMeeting,
  getUserMeetings,
  getMeetingById,
  acceptMeeting,
  declineMeeting,
  updateMeeting,
  cancelMeeting,
  completeMeeting,
  getAvailableSlots,
} from '../controllers/meetingController';

const router = Router();

// Schedule meeting validation
const scheduleValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Meeting title is required')
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('participantIds')
    .isArray({ min: 1 })
    .withMessage('At least one participant is required')
    .custom((value: string[]) => {
      if (!Array.isArray(value)) return false;
      return value.every(id => /^[a-f\d]{24}$/i.test(id));
    })
    .withMessage('Valid participant IDs are required'),
  body('startTime')
    .isISO8601()
    .withMessage('Valid start time is required')
    .custom((value: string) => {
      const startTime = new Date(value);
      if (startTime <= new Date()) {
        throw new Error('Start time must be in the future');
      }
      return true;
    }),
  body('endTime')
    .isISO8601()
    .withMessage('Valid end time is required')
    .custom((value: string, { req }) => {
      const endTime = new Date(value);
      const startTime = new Date((req.body as any).startTime);
      if (endTime <= startTime) {
        throw new Error('End time must be after start time');
      }
      return true;
    }),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location must not exceed 200 characters'),
  body('meetingLink')
    .optional()
    .trim()
    .matches(/^https?:\/\/.+/)
    .withMessage('Valid meeting link URL is required'),
  body('meetingType')
    .optional()
    .isIn(['one-on-one', 'group', 'webinar'])
    .withMessage('Invalid meeting type'),
];

// Update meeting validation
const updateValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location must not exceed 200 characters'),
  body('meetingLink')
    .optional()
    .trim()
    .matches(/^https?:\/\/.+/)
    .withMessage('Valid meeting link URL is required'),
  body('meetingType')
    .optional()
    .isIn(['one-on-one', 'group', 'webinar'])
    .withMessage('Invalid meeting type'),
];

/**
 * @route   POST /api/meetings/schedule
 * @desc    Schedule a new meeting
 * @access  Private
 */
router.post('/schedule', authenticate, scheduleValidation, scheduleMeeting);

/**
 * @route   GET /api/meetings
 * @desc    Get all meetings for current user
 * @access  Private
 */
router.get('/', authenticate, getUserMeetings);

/**
 * @route   GET /api/meetings/:meetingId
 * @desc    Get a specific meeting
 * @access  Private
 */
router.get('/:meetingId', authenticate, getMeetingById);

/**
 * @route   POST /api/meetings/:meetingId/accept
 * @desc    Accept a meeting invitation
 * @access  Private
 */
router.post('/:meetingId/accept', authenticate, acceptMeeting);

/**
 * @route   POST /api/meetings/:meetingId/decline
 * @desc    Decline a meeting invitation
 * @access  Private
 */
router.post('/:meetingId/decline', authenticate, declineMeeting);

/**
 * @route   PUT /api/meetings/:meetingId
 * @desc    Update a meeting (organizer only)
 * @access  Private
 */
router.put('/:meetingId', authenticate, updateValidation, updateMeeting);

/**
 * @route   POST /api/meetings/:meetingId/cancel
 * @desc    Cancel a meeting (organizer only)
 * @access  Private
 */
router.post('/:meetingId/cancel', authenticate, cancelMeeting);

/**
 * @route   POST /api/meetings/:meetingId/complete
 * @desc    Mark meeting as completed (organizer only)
 * @access  Private
 */
router.post('/:meetingId/complete', authenticate, completeMeeting);

/**
 * @route   GET /api/meetings/availability/:userId
 * @desc    Get available time slots for a user
 * @access  Private
 */
router.get('/availability/:userId', authenticate, getAvailableSlots);

export default router;
