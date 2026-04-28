"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableSlots = exports.completeMeeting = exports.cancelMeeting = exports.updateMeeting = exports.declineMeeting = exports.acceptMeeting = exports.getMeetingById = exports.getUserMeetings = exports.scheduleMeeting = void 0;
const express_validator_1 = require("express-validator");
const Meeting_1 = require("../models/Meeting");
const User_1 = require("../models/User");
/**
 * Check for scheduling conflicts
 * @param startTime - Meeting start time
 * @param endTime - Meeting end time
 * @param participantIds - Array of participant IDs
 * @param exceptMeetingId - Meeting ID to exclude from conflict check (for updates)
 * @returns Object with conflicts found and affected participants
 */
async function checkConflicts(startTime, endTime, participantIds, exceptMeetingId) {
    try {
        const query = {
            participantIds: { $in: participantIds },
            startTime: { $lt: endTime },
            endTime: { $gt: startTime },
            status: { $nin: ['cancelled', 'declined'] },
        };
        if (exceptMeetingId) {
            query._id = { $ne: exceptMeetingId };
        }
        const conflicts = await Meeting_1.Meeting.find(query);
        if (conflicts.length > 0) {
            return {
                hasConflict: true,
                conflictCount: conflicts.length,
                conflicts: conflicts.map(c => ({
                    id: c._id,
                    title: c.title,
                    startTime: c.startTime,
                    endTime: c.endTime,
                    affectedParticipants: c.participantIds.filter(p => participantIds.includes(p.toString())),
                })),
            };
        }
        return { hasConflict: false };
    }
    catch (error) {
        throw new Error('Error checking for conflicts: ' + error.message);
    }
}
/**
 * Schedule a new meeting
 * @route POST /api/meetings/schedule
 * @access Private
 */
const scheduleMeeting = async (req, res) => {
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
        const { title, description, participantIds, startTime, endTime, location, meetingLink, meetingType } = req.body;
        const organizerId = req.user?.userId;
        // Check for conflicts
        const conflictCheck = await checkConflicts(new Date(startTime), new Date(endTime), participantIds);
        if (conflictCheck.hasConflict) {
            res.status(409).json({
                success: false,
                message: 'Scheduling conflict detected',
                conflicts: conflictCheck.conflicts,
            });
            return;
        }
        // Verify organizer and participants exist
        const users = await User_1.User.find({
            _id: { $in: [organizerId, ...participantIds] },
        });
        if (users.length !== participantIds.length + 1) {
            res.status(400).json({
                success: false,
                message: 'One or more participants do not exist',
            });
            return;
        }
        // Create participant response array with pending status
        const participantResponses = participantIds.map((id) => ({
            userId: id,
            response: 'pending',
        }));
        const meeting = new Meeting_1.Meeting({
            title,
            description,
            organizerId,
            participantIds,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            location,
            meetingLink,
            meetingType,
            participantResponses,
            status: 'scheduled',
        });
        await meeting.save();
        await meeting.populate([
            { path: 'organizerId', select: 'name email avatarUrl' },
            { path: 'participantIds', select: 'name email avatarUrl' },
        ]);
        res.status(201).json({
            success: true,
            message: 'Meeting scheduled successfully',
            data: meeting,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error scheduling meeting',
            error: error.message,
        });
    }
};
exports.scheduleMeeting = scheduleMeeting;
/**
 * Get all meetings for a user (as organizer or participant)
 * @route GET /api/meetings
 * @access Private
 */
const getUserMeetings = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { status, startDate, endDate, type } = req.query;
        const query = {
            $or: [
                { organizerId: userId },
                { participantIds: userId },
            ],
        };
        if (status) {
            query.status = status;
        }
        if (startDate || endDate) {
            query.startTime = {};
            if (startDate) {
                query.startTime.$gte = new Date(startDate);
            }
            if (endDate) {
                query.startTime.$lte = new Date(endDate);
            }
        }
        if (type) {
            query.meetingType = type;
        }
        const meetings = await Meeting_1.Meeting.find(query)
            .populate('organizerId', 'name email avatarUrl')
            .populate('participantIds', 'name email avatarUrl')
            .sort({ startTime: 1 });
        res.status(200).json({
            success: true,
            count: meetings.length,
            data: meetings,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching meetings',
            error: error.message,
        });
    }
};
exports.getUserMeetings = getUserMeetings;
/**
 * Get a specific meeting by ID
 * @route GET /api/meetings/:meetingId
 * @access Private
 */
const getMeetingById = async (req, res) => {
    try {
        const { meetingId } = req.params;
        const meeting = await Meeting_1.Meeting.findById(meetingId)
            .populate('organizerId', 'name email avatarUrl role')
            .populate('participantIds', 'name email avatarUrl role');
        if (!meeting) {
            res.status(404).json({
                success: false,
                message: 'Meeting not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: meeting,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching meeting',
            error: error.message,
        });
    }
};
exports.getMeetingById = getMeetingById;
/**
 * Accept a meeting invitation
 * @route POST /api/meetings/:meetingId/accept
 * @access Private
 */
const acceptMeeting = async (req, res) => {
    try {
        const { meetingId } = req.params;
        const userId = req.user?.userId;
        const meeting = await Meeting_1.Meeting.findById(meetingId);
        if (!meeting) {
            res.status(404).json({
                success: false,
                message: 'Meeting not found',
            });
            return;
        }
        // Find participant response
        const participantResponse = meeting.participantResponses.find(pr => pr.userId.toString() === userId);
        if (!participantResponse) {
            res.status(400).json({
                success: false,
                message: 'User is not a participant in this meeting',
            });
            return;
        }
        // Update response
        participantResponse.response = 'accepted';
        participantResponse.respondedAt = new Date();
        // Check if all participants accepted
        const allAccepted = meeting.participantResponses.every(pr => pr.response === 'accepted');
        if (allAccepted) {
            meeting.status = 'confirmed';
        }
        await meeting.save();
        await meeting.populate([
            { path: 'organizerId', select: 'name email avatarUrl' },
            { path: 'participantIds', select: 'name email avatarUrl' },
        ]);
        res.status(200).json({
            success: true,
            message: 'Meeting accepted successfully',
            data: meeting,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error accepting meeting',
            error: error.message,
        });
    }
};
exports.acceptMeeting = acceptMeeting;
/**
 * Decline a meeting invitation
 * @route POST /api/meetings/:meetingId/decline
 * @access Private
 */
const declineMeeting = async (req, res) => {
    try {
        const { meetingId } = req.params;
        const userId = req.user?.userId;
        const meeting = await Meeting_1.Meeting.findById(meetingId);
        if (!meeting) {
            res.status(404).json({
                success: false,
                message: 'Meeting not found',
            });
            return;
        }
        // Find participant response
        const participantResponse = meeting.participantResponses.find(pr => pr.userId.toString() === userId);
        if (!participantResponse) {
            res.status(400).json({
                success: false,
                message: 'User is not a participant in this meeting',
            });
            return;
        }
        // Update response
        participantResponse.response = 'declined';
        participantResponse.respondedAt = new Date();
        await meeting.save();
        await meeting.populate([
            { path: 'organizerId', select: 'name email avatarUrl' },
            { path: 'participantIds', select: 'name email avatarUrl' },
        ]);
        res.status(200).json({
            success: true,
            message: 'Meeting declined successfully',
            data: meeting,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error declining meeting',
            error: error.message,
        });
    }
};
exports.declineMeeting = declineMeeting;
/**
 * Update a meeting
 * @route PUT /api/meetings/:meetingId
 * @access Private (organizer only)
 */
const updateMeeting = async (req, res) => {
    try {
        const { meetingId } = req.params;
        const userId = req.user?.userId;
        const { title, description, startTime, endTime, location, meetingLink, meetingType } = req.body;
        const meeting = await Meeting_1.Meeting.findById(meetingId);
        if (!meeting) {
            res.status(404).json({
                success: false,
                message: 'Meeting not found',
            });
            return;
        }
        // Only organizer can update
        if (meeting.organizerId.toString() !== userId) {
            res.status(403).json({
                success: false,
                message: 'Only meeting organizer can update',
            });
            return;
        }
        // If time is being changed, check for conflicts
        if (startTime || endTime) {
            const newStartTime = startTime ? new Date(startTime) : meeting.startTime;
            const newEndTime = endTime ? new Date(endTime) : meeting.endTime;
            const conflictCheck = await checkConflicts(newStartTime, newEndTime, meeting.participantIds.map(p => p.toString()), meetingId);
            if (conflictCheck.hasConflict) {
                res.status(409).json({
                    success: false,
                    message: 'Scheduling conflict detected with updated time',
                    conflicts: conflictCheck.conflicts,
                });
                return;
            }
            meeting.startTime = newStartTime;
            meeting.endTime = newEndTime;
        }
        // Update other fields
        if (title)
            meeting.title = title;
        if (description)
            meeting.description = description;
        if (location)
            meeting.location = location;
        if (meetingLink)
            meeting.meetingLink = meetingLink;
        if (meetingType)
            meeting.meetingType = meetingType;
        await meeting.save();
        await meeting.populate([
            { path: 'organizerId', select: 'name email avatarUrl' },
            { path: 'participantIds', select: 'name email avatarUrl' },
        ]);
        res.status(200).json({
            success: true,
            message: 'Meeting updated successfully',
            data: meeting,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating meeting',
            error: error.message,
        });
    }
};
exports.updateMeeting = updateMeeting;
/**
 * Cancel a meeting
 * @route POST /api/meetings/:meetingId/cancel
 * @access Private (organizer only)
 */
const cancelMeeting = async (req, res) => {
    try {
        const { meetingId } = req.params;
        const userId = req.user?.userId;
        const meeting = await Meeting_1.Meeting.findById(meetingId);
        if (!meeting) {
            res.status(404).json({
                success: false,
                message: 'Meeting not found',
            });
            return;
        }
        // Only organizer can cancel
        if (meeting.organizerId.toString() !== userId) {
            res.status(403).json({
                success: false,
                message: 'Only meeting organizer can cancel',
            });
            return;
        }
        meeting.status = 'cancelled';
        await meeting.save();
        res.status(200).json({
            success: true,
            message: 'Meeting cancelled successfully',
            data: meeting,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error cancelling meeting',
            error: error.message,
        });
    }
};
exports.cancelMeeting = cancelMeeting;
/**
 * Complete a meeting
 * @route POST /api/meetings/:meetingId/complete
 * @access Private (organizer only)
 */
const completeMeeting = async (req, res) => {
    try {
        const { meetingId } = req.params;
        const userId = req.user?.userId;
        const meeting = await Meeting_1.Meeting.findById(meetingId);
        if (!meeting) {
            res.status(404).json({
                success: false,
                message: 'Meeting not found',
            });
            return;
        }
        // Only organizer can mark as complete
        if (meeting.organizerId.toString() !== userId) {
            res.status(403).json({
                success: false,
                message: 'Only meeting organizer can mark as complete',
            });
            return;
        }
        meeting.status = 'completed';
        await meeting.save();
        res.status(200).json({
            success: true,
            message: 'Meeting marked as completed',
            data: meeting,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error marking meeting as complete',
            error: error.message,
        });
    }
};
exports.completeMeeting = completeMeeting;
/**
 * Get available time slots for a user
 * @route GET /api/meetings/availability/:userId
 * @access Private
 */
const getAvailableSlots = async (req, res) => {
    try {
        const { userId } = req.params;
        const { date, duration } = req.query;
        if (!date) {
            res.status(400).json({
                success: false,
                message: 'Date parameter is required',
            });
            return;
        }
        const targetDate = new Date(date);
        const meetingDuration = parseInt(duration) || 30; // minutes
        // Get all meetings for the user on that date
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);
        const meetings = await Meeting_1.Meeting.find({
            $or: [
                { organizerId: userId },
                { participantIds: userId },
            ],
            startTime: { $gte: startOfDay, $lte: endOfDay },
            status: { $nin: ['cancelled'] },
        }).sort({ startTime: 1 });
        // Generate available slots (9 AM to 6 PM, 30-min intervals)
        const availableSlots = [];
        const workingHourStart = 9;
        const workingHourEnd = 18;
        let currentTime = new Date(targetDate);
        currentTime.setHours(workingHourStart, 0, 0, 0);
        while (currentTime.getHours() < workingHourEnd) {
            const slotEnd = new Date(currentTime);
            slotEnd.setMinutes(slotEnd.getMinutes() + meetingDuration);
            const isConflict = meetings.some(m => currentTime < m.endTime && slotEnd > m.startTime);
            if (!isConflict && slotEnd.getHours() <= workingHourEnd) {
                availableSlots.push({
                    start: new Date(currentTime),
                    end: new Date(slotEnd),
                });
            }
            currentTime.setMinutes(currentTime.getMinutes() + 30);
        }
        res.status(200).json({
            success: true,
            date,
            duration: meetingDuration,
            availableSlots,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error getting available slots',
            error: error.message,
        });
    }
};
exports.getAvailableSlots = getAvailableSlots;
