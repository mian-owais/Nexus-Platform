"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meeting = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const meetingSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a meeting title'],
        trim: true,
        maxlength: 200,
    },
    description: {
        type: String,
        maxlength: 1000,
    },
    organizerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please specify meeting organizer'],
    },
    participantIds: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: 'User',
        default: [],
        validate: {
            validator: function (v) {
                return Array.isArray(v) && v.length > 0;
            },
            message: 'At least one participant is required',
        },
    },
    startTime: {
        type: Date,
        required: [true, 'Please specify meeting start time'],
        validate: {
            validator: function (v) {
                return v > new Date();
            },
            message: 'Meeting start time must be in the future',
        },
    },
    endTime: {
        type: Date,
        required: [true, 'Please specify meeting end time'],
        validate: {
            validator: function (v) {
                return v > this.startTime;
            },
            message: 'Meeting end time must be after start time',
        },
    },
    location: {
        type: String,
        maxlength: 200,
    },
    meetingLink: {
        type: String,
        match: [
            /^https?:\/\/.+/,
            'Please provide a valid meeting link',
        ],
    },
    status: {
        type: String,
        enum: ['scheduled', 'confirmed', 'cancelled', 'completed'],
        default: 'scheduled',
    },
    participantResponses: [
        {
            userId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            response: {
                type: String,
                enum: ['accepted', 'declined', 'pending'],
                default: 'pending',
            },
            respondedAt: {
                type: Date,
            },
        },
    ],
    meetingType: {
        type: String,
        enum: ['one-on-one', 'group', 'webinar'],
        default: 'one-on-one',
    },
    recurrence: {
        pattern: {
            type: String,
            enum: ['none', 'daily', 'weekly', 'monthly'],
            default: 'none',
        },
        endDate: {
            type: Date,
        },
    },
}, { timestamps: true });
// Index for faster queries
meetingSchema.index({ organizerId: 1, startTime: 1 });
meetingSchema.index({ 'participantIds': 1 });
meetingSchema.index({ startTime: 1, endTime: 1 });
exports.Meeting = mongoose_1.default.model('Meeting', meetingSchema);
