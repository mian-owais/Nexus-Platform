import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
/**
 * Schedule a new meeting
 * @route POST /api/meetings/schedule
 * @access Private
 */
export declare const scheduleMeeting: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * Get all meetings for a user (as organizer or participant)
 * @route GET /api/meetings
 * @access Private
 */
export declare const getUserMeetings: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * Get a specific meeting by ID
 * @route GET /api/meetings/:meetingId
 * @access Private
 */
export declare const getMeetingById: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * Accept a meeting invitation
 * @route POST /api/meetings/:meetingId/accept
 * @access Private
 */
export declare const acceptMeeting: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * Decline a meeting invitation
 * @route POST /api/meetings/:meetingId/decline
 * @access Private
 */
export declare const declineMeeting: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * Update a meeting
 * @route PUT /api/meetings/:meetingId
 * @access Private (organizer only)
 */
export declare const updateMeeting: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * Cancel a meeting
 * @route POST /api/meetings/:meetingId/cancel
 * @access Private (organizer only)
 */
export declare const cancelMeeting: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * Complete a meeting
 * @route POST /api/meetings/:meetingId/complete
 * @access Private (organizer only)
 */
export declare const completeMeeting: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * Get available time slots for a user
 * @route GET /api/meetings/availability/:userId
 * @access Private
 */
export declare const getAvailableSlots: (req: AuthenticatedRequest, res: Response) => Promise<void>;
