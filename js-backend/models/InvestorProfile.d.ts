import mongoose from 'mongoose';
export interface IInvestorProfile extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    investmentInterests: string[];
    investmentStage: string[];
    portfolioCompanies: string[];
    totalInvestments: number;
    minimumInvestment: string;
    maximumInvestment: string;
    yearsOfExperience?: number;
    company?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const InvestorProfile: mongoose.Model<IInvestorProfile, {}, {}, {}, mongoose.Document<unknown, {}, IInvestorProfile, {}, {}> & IInvestorProfile & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
