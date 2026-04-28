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
export declare const Meeting: mongoose.Model<IMeeting, {}, {}, {}, mongoose.Document<unknown, {}, IMeeting, {}, {}> & IMeeting & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
