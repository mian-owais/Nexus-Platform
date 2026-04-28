import mongoose from 'mongoose';
export interface IEntrepreneurProfile extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    startupName: string;
    pitchSummary: string;
    fundingNeeded: string;
    industry: string;
    location: string;
    foundedYear: number;
    teamSize: number;
    website?: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
        github?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
export declare const EntrepreneurProfile: mongoose.Model<IEntrepreneurProfile, {}, {}, {}, mongoose.Document<unknown, {}, IEntrepreneurProfile, {}, {}> & IEntrepreneurProfile & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
