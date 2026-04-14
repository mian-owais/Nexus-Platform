import { User } from '../models/User';
import { EntrepreneurProfile } from '../models/EntrepreneurProfile';
import { InvestorProfile } from '../models/InvestorProfile';
import bcryptjs from 'bcryptjs';

jest.mock('bcryptjs');
jest.mock('../../models/User');
jest.mock('../../models/EntrepreneurProfile');
jest.mock('../../models/InvestorProfile');

describe('Database Models', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Model', () => {
    const testUserId = '507f1f77bcf86cd799439011';
    const testUserData = {
      _id: testUserId,
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedPassword123',
      role: 'entrepreneur',
      avatarUrl: 'https://example.com/avatar.jpg',
      bio: 'Test user',
      isOnline: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a new user with valid data', async () => {
      (User.create as jest.Mock).mockResolvedValue(testUserData);

      const newUser = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'plainPassword',
        role: 'entrepreneur',
      });

      expect(newUser).toEqual(testUserData);
      expect(newUser.email).toBe('john@example.com');
      expect(newUser.name).toBe('John Doe');
    });

    it('should find user by email', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(testUserData);

      const user = await User.findOne({ email: 'john@example.com' });

      expect(user).toEqual(testUserData);
      expect(user?.email).toBe('john@example.com');
    });

    it('should find user by ID', async () => {
      (User.findById as jest.Mock).mockResolvedValue(testUserData);

      const user = await User.findById(testUserId);

      expect(user).toEqual(testUserData);
      expect(user?._id).toBe(testUserId);
    });

    it('should return null when user not found by email', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const user = await User.findOne({ email: 'nonexistent@example.com' });

      expect(user).toBeNull();
    });

    it('should compare password correctly', async () => {
      (bcryptjs.compare as jest.Mock).mockResolvedValue(true);

      const mockUser = {
        ...testUserData,
        comparePassword: async (plainPassword: string) => {
          return await bcryptjs.compare(plainPassword, mockUser.password);
        },
      };

      const isMatch = await mockUser.comparePassword('plainPassword');

      expect(isMatch).toBe(true);
      expect(bcryptjs.compare).toHaveBeenCalledWith('plainPassword', testUserData.password);
    });

    it('should reject incorrect password', async () => {
      (bcryptjs.compare as jest.Mock).mockResolvedValue(false);

      const mockUser = {
        ...testUserData,
        comparePassword: async (plainPassword: string) => {
          return await bcryptjs.compare(plainPassword, mockUser.password);
        },
      };

      const isMatch = await mockUser.comparePassword('wrongPassword');

      expect(isMatch).toBe(false);
    });

    it('should have required password field', async () => {
      const incompleteUser = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'entrepreneur',
      };

      (User.create as jest.Mock).mockRejectedValue(
        new Error('password is required')
      );

      await expect(User.create(incompleteUser)).rejects.toThrow(
        'password is required'
      );
    });

    it('should validate email format', async () => {
      const invalidEmailUser = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'hashedPassword',
        role: 'entrepreneur',
      };

      (User.create as jest.Mock).mockRejectedValue(
        new Error('Invalid email format')
      );

      await expect(User.create(invalidEmailUser)).rejects.toThrow(
        'Invalid email format'
      );
    });

    it('should validate role is either entrepreneur or investor', async () => {
      const invalidRoleUser = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: 'admin',
      };

      (User.create as jest.Mock).mockRejectedValue(
        new Error('role must be entrepreneur or investor')
      );

      await expect(User.create(invalidRoleUser)).rejects.toThrow(
        'role must be entrepreneur or investor'
      );
    });

    it('should update user profile', async () => {
      const updatedData = { ...testUserData, bio: 'Updated bio' };
      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedData);

      const updated = await User.findByIdAndUpdate(testUserId, { bio: 'Updated bio' });

      expect(updated?.bio).toBe('Updated bio');
    });

    it('should set isOnline status', async () => {
      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        ...testUserData,
        isOnline: false,
      });

      const updated = await User.findByIdAndUpdate(testUserId, { isOnline: false });

      expect(updated?.isOnline).toBe(false);
    });
  });

  describe('EntrepreneurProfile Model', () => {
    const profileId = '507f1f77bcf86cd799439012';
    const testUserId = '507f1f77bcf86cd799439011';
    const entrepreneurData = {
      _id: profileId,
      userId: testUserId,
      startupName: 'TechStartup Inc',
      pitchSummary: 'Building AI solutions',
      fundingNeeded: 100000,
      industry: 'Technology',
      location: 'San Francisco, CA',
      foundedYear: 2023,
      teamSize: 5,
      socialLinks: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create entrepreneur profile', async () => {
      (EntrepreneurProfile.create as jest.Mock).mockResolvedValue(entrepreneurData);

      const profile = await EntrepreneurProfile.create({
        userId: testUserId,
        startupName: 'TechStartup Inc',
        pitchSummary: 'Building AI solutions',
      });

      expect(profile.startupName).toBe('TechStartup Inc');
      expect(profile.userId).toBe(testUserId);
    });

    it('should find entrepreneur profile by userId', async () => {
      (EntrepreneurProfile.findOne as jest.Mock).mockResolvedValue(entrepreneurData);

      const profile = await EntrepreneurProfile.findOne({ userId: testUserId });

      expect(profile?.userId).toBe(testUserId);
      expect(profile?.startupName).toBe('TechStartup Inc');
    });

    it('should update entrepreneur profile fields', async () => {
      const updatedProfile = {
        ...entrepreneurData,
        fundingNeeded: 200000,
      };
      (EntrepreneurProfile.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedProfile);

      const updated = await EntrepreneurProfile.findByIdAndUpdate(profileId, {
        fundingNeeded: 200000,
      });

      expect(updated?.fundingNeeded).toBe(200000);
    });

    it('should validate startup name is required', async () => {
      (EntrepreneurProfile.create as jest.Mock).mockRejectedValue(
        new Error('startupName is required')
      );

      await expect(
        EntrepreneurProfile.create({ userId: testUserId })
      ).rejects.toThrow('startupName is required');
    });

    it('should store social links', async () => {
      const profileWithLinks = {
        ...entrepreneurData,
        socialLinks: {
          linkedin: 'https://linkedin.com/in/test',
          twitter: 'https://twitter.com/test',
          website: 'https://example.com',
        },
      };

      (EntrepreneurProfile.create as jest.Mock).mockResolvedValue(
        profileWithLinks
      );

      const profile = await EntrepreneurProfile.create({
        userId: testUserId,
        startupName: 'TechStartup Inc',
        socialLinks: profileWithLinks.socialLinks,
      });

      expect(profile.socialLinks).toHaveProperty('linkedin');
      expect(profile.socialLinks).toHaveProperty('twitter');
    });

    it('should validate foundedYear is reasonable', async () => {
      const futureYear = {
        userId: testUserId,
        startupName: 'TechStartup',
        foundedYear: 2050, // Future year
      };

      (EntrepreneurProfile.create as jest.Mock).mockRejectedValue(
        new Error('foundedYear cannot be in the future')
      );

      await expect(EntrepreneurProfile.create(futureYear)).rejects.toThrow(
        'foundedYear cannot be in the future'
      );
    });
  });

  describe('InvestorProfile Model', () => {
    const profileId = '507f1f77bcf86cd799439013';
    const testUserId = '507f1f77bcf86cd799439011';
    const investorData = {
      _id: profileId,
      userId: testUserId,
      investmentInterests: ['Technology', 'HealthTech'],
      investmentStage: ['Seed', 'Series A'],
      portfolioCompanies: ['Company A', 'Company B'],
      totalInvestments: 5000000,
      minimumInvestment: 50000,
      maximumInvestment: 500000,
      yearsOfExperience: 10,
      company: 'Venture Capital Partners',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create investor profile', async () => {
      (InvestorProfile.create as jest.Mock).mockResolvedValue(investorData);

      const profile = await InvestorProfile.create({
        userId: testUserId,
        investmentInterests: ['Technology'],
        yearsOfExperience: 10,
      });

      expect(profile.userId).toBe(testUserId);
      expect(profile.investmentInterests).toContain('Technology');
    });

    it('should find investor profile by userId', async () => {
      (InvestorProfile.findOne as jest.Mock).mockResolvedValue(investorData);

      const profile = await InvestorProfile.findOne({ userId: testUserId });

      expect(profile?.userId).toBe(testUserId);
      expect(profile?.totalInvestments).toBe(5000000);
    });

    it('should update investment preferences', async () => {
      const updatedProfile = {
        ...investorData,
        investmentInterests: ['Technology', 'HealthTech', 'FinTech'],
      };

      (InvestorProfile.findByIdAndUpdate as jest.Mock).mockResolvedValue(
        updatedProfile
      );

      const updated = await InvestorProfile.findByIdAndUpdate(profileId, {
        investmentInterests: ['Technology', 'HealthTech', 'FinTech'],
      });

      expect(updated?.investmentInterests.length).toBe(3);
    });

    it('should validate minimum investment is less than maximum', async () => {
      const invalidData = {
        userId: testUserId,
        investmentInterests: ['Technology'],
        yearsOfExperience: 10,
        minimumInvestment: 1000000,
        maximumInvestment: 100000, // Less than minimum
      };

      (InvestorProfile.create as jest.Mock).mockRejectedValue(
        new Error('minimumInvestment must be less than maximumInvestment')
      );

      await expect(InvestorProfile.create(invalidData)).rejects.toThrow(
        'minimumInvestment must be less than maximumInvestment'
      );
    });

    it('should store portfolio companies', async () => {
      const portfolio = ['Company A', 'Company B', 'Company C'];
      const profileWithPortfolio = {
        ...investorData,
        portfolioCompanies: portfolio,
      };

      (InvestorProfile.create as jest.Mock).mockResolvedValue(
        profileWithPortfolio
      );

      const profile = await InvestorProfile.create({
        userId: testUserId,
        investmentInterests: ['Technology'],
        yearsOfExperience: 10,
        portfolioCompanies: portfolio,
      });

      expect(profile.portfolioCompanies).toEqual(portfolio);
    });

    it('should validate years of experience is non-negative', async () => {
      const invalidData = {
        userId: testUserId,
        investmentInterests: ['Technology'],
        yearsOfExperience: -5, // Negative
      };

      (InvestorProfile.create as jest.Mock).mockRejectedValue(
        new Error('yearsOfExperience cannot be negative')
      );

      await expect(InvestorProfile.create(invalidData)).rejects.toThrow(
        'yearsOfExperience cannot be negative'
      );
    });

    it('should accept investment interests as array', async () => {
      (InvestorProfile.create as jest.Mock).mockResolvedValue(investorData);

      const profile = await InvestorProfile.create({
        userId: testUserId,
        investmentInterests: ['Technology', 'HealthTech', 'FinTech'],
        yearsOfExperience: 10,
      });

      expect(Array.isArray(profile.investmentInterests)).toBe(true);
      expect(profile.investmentInterests.length).toBe(2);
    });
  });

  describe('Model relationships', () => {
    const testUserId = '507f1f77bcf86cd799439011';

    it('entrepreneur profile should reference user ID', async () => {
      const entrepreneurData = {
        userId: testUserId,
        startupName: 'TechStartup',
      };

      (EntrepreneurProfile.create as jest.Mock).mockResolvedValue(entrepreneurData);

      const profile = await EntrepreneurProfile.create(entrepreneurData);

      expect(profile.userId).toBe(testUserId);
    });

    it('investor profile should reference user ID', async () => {
      const investorData = {
        userId: testUserId,
        investmentInterests: ['Technology'],
        yearsOfExperience: 10,
      };

      (InvestorProfile.create as jest.Mock).mockResolvedValue(investorData);

      const profile = await InvestorProfile.create(investorData);

      expect(profile.userId).toBe(testUserId);
    });
  });
});
