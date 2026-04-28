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

const investorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    investmentInterests: {
      type: [String],
      default: [],
    },
    investmentStage: {
      type: [String],
      enum: ['seed', 'series_a', 'series_b', 'series_c', 'growth', 'exit'],
      default: [],
    },
    portfolioCompanies: {
      type: [String],
      default: [],
    },
    totalInvestments: {
      type: Number,
      default: 0,
      min: 0,
    },
    minimumInvestment: {
      type: String,
      default: '',
      trim: true,
    },
    maximumInvestment: {
      type: String,
      default: '',
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
      min: 0,
      max: 70,
    },
    company: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const InvestorProfile = mongoose.model<IInvestorProfile>(
  'InvestorProfile',
  investorProfileSchema
);
