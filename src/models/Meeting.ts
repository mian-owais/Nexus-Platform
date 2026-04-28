import mongoose from 'mongoose';

export interface IMeeting extends mongoose.Document {
  title: string;
  description?: string;
  organizerId: mongoose.Types.ObjectId;
  participantIds: mongoose.Types.ObjectId[];
  startTime: Date;
  endTime: Date;
  location?: string;
  meetingLink?: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  participantResponses: {
    userId: mongoose.Types.ObjectId;
    response: 'accepted' | 'declined' | 'pending';
    respondedAt?: Date;
  }[];
  meetingType: 'one-on-one' | 'group' | 'webinar';
  recurrence?: {
    pattern: 'none' | 'daily' | 'weekly' | 'monthly';
    endDate?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const meetingSchema = new mongoose.Schema(
  {
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please specify meeting organizer'],
    },
    participantIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
      validate: {
        validator: function (v: mongoose.Types.ObjectId[]) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'At least one participant is required',
      },
    },
    startTime: {
      type: Date,
      required: [true, 'Please specify meeting start time'],
      validate: {
        validator: function (v: Date) {
          return v > new Date();
        },
        message: 'Meeting start time must be in the future',
      },
    },
    endTime: {
      type: Date,
      required: [true, 'Please specify meeting end time'],
      validate: {
        validator: function (this: IMeeting, v: Date) {
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
          type: mongoose.Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

// Index for faster queries
meetingSchema.index({ organizerId: 1, startTime: 1 });
meetingSchema.index({ 'participantIds': 1 });
meetingSchema.index({ startTime: 1, endTime: 1 });

export const Meeting = mongoose.model<IMeeting>('Meeting', meetingSchema);
