# Nexus Backend Setup & Integration Guide

This guide provides comprehensive instructions for setting up and running the Nexus backend server alongside the frontend application.

## Overview

The Nexus backend is a Node.js + Express server with the following features:

- **JWT-based Authentication** - Secure login and registration
- **Role-based Access Control** - Separate dashboards for Investors and Entrepreneurs
- **MongoDB Integration** - Persistent user profiles and data storage
- **API Endpoints** - RESTful API for all frontend features
- **Password Security** - Bcryptjs with 10 salt rounds
- **Input Validation** - Express-validator for all requests

## Backend Project Location

```
backend/
├── src/
│   ├── config/database.ts          # MongoDB connection
│   ├── models/                     # Database schemas
│   │   ├── User.ts
│   │   ├── EntrepreneurProfile.ts
│   │   └── InvestorProfile.ts
│   ├── controllers/                # Business logic
│   │   ├── authController.ts
│   │   └── userController.ts
│   ├── middleware/auth.ts          # JWT authentication
│   ├── routes/                     # API endpoints
│   │   ├── authRoutes.ts
│   │   └── userRoutes.ts
│   ├── utils/jwt.ts                # Token utilities
│   └── server.ts                   # Main server file
├── package.json
├── tsconfig.json
├── .env.example
├── .env.local
└── README.md
```

## Prerequisites

### System Requirements
- Node.js >= 18.0.0
- npm or yarn
- MongoDB (local or MongoDB Atlas)

### Verify Node.js Installation

```bash
node --version    # Should be v18.0.0 or higher
npm --version     # Should be 9.0.0 or higher
```

## Step 1: Install MongoDB

### Option A: MongoDB Community Edition (Local)

**Windows:**
1. Download from: https://www.mongodb.com/try/download/community
2. Run the installer
3. MongoDB will start as a Windows service
4. Verify connection: `mongosh` or `mongo`

**macOS (with Homebrew):**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongod
```

### Option B: MongoDB Atlas (Cloud - Recommended)

1. Create free account: https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Create database credentials
4. Get connection string (keep it secure!)
5. Update `.env.local` with your connection string

## Step 2: Backend Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

This installs all required packages:
- express - HTTP server framework
- mongoose - MongoDB driver
- jsonwebtoken - JWT authentication
- bcryptjs - Password hashing
- express-validator - Input validation
- dotenv - Environment variables
- cors - Cross-origin requests

### 2. Configure Environment Variables

Copy the example file:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000

# Database (choose one)
# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/nexus

# OR MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nexus

# JWT Secrets (change these in production!)
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRE=30d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Important:** Never commit `.env.local` to git. It's in `.gitignore`.

### 3. Verify MongoDB Connection

```bash
# Test local MongoDB
mongosh
# or
mongo

# You should see: > 
```

## Step 3: Start the Backend Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

Expected output:
```
✓ MongoDB Connected: localhost
✓ Server running on http://localhost:5000
✓ API available at http://localhost:5000/api
```

### Production Mode

First, build the project:
```bash
npm run build
```

Then run:
```bash
npm start
```

## Step 4: Test the API

### Using Postman or Insomnia

**Test 1: Health Check**
```
GET http://localhost:5000/api/health
```

Expected Response:
```json
{
  "success": true,
  "message": "Nexus Backend is running",
  "timestamp": "2026-04-14T10:00:00.000Z"
}
```

**Test 2: Register User**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Entrepreneur",
  "email": "john@startup.com",
  "password": "SecurePass123",
  "role": "entrepreneur"
}
```

**Test 3: Login**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@startup.com",
  "password": "SecurePass123",
  "role": "entrepreneur"
}
```

Response includes `token` - use this for authenticated requests:
```
Authorization: Bearer {token}
```

**Test 4: Get User Profile**
```
GET http://localhost:5000/api/users/:userId
Authorization: Bearer {token}
```

## Step 5: Connect Frontend to Backend

### Update Frontend API Configuration

Edit `src/context/AuthContext.tsx` to use real backend:

```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const login = async (email: string, password: string, role: UserRole): Promise<void> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
      role
    });
    
    const { token, user } = response.data.data;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('business_nexus_user', JSON.stringify(user));
    
    setUser(user);
  } catch (error) {
    throw new Error((error as any).response?.data?.message || 'Login failed');
  }
};
```

### Create `.env.local` in Frontend

Create `Nexus/.env.local`:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_FRONTEND_URL=http://localhost:5173
```

## Running Both Frontend and Backend

### Terminal 1: Start Backend
```bash
cd backend
npm run dev
# Port 5000
```

### Terminal 2: Start Frontend
```bash
cd Nexus
npm run dev
# Port 5173
```

Both will run simultaneously. Frontend makes API calls to backend.

## API Endpoints Reference

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh-token` - Refresh JWT token

### User Endpoints  
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update user profile
- `PUT /api/profile/entrepreneur/:id` - Update entrepreneur details
- `PUT /api/profile/investor/:id` - Update investor details
- `GET /api/users/list/entrepreneurs` - List entrepreneurs
- `GET /api/users/list/investors` - List investors

See `Milestone2.txt` for complete API specifications.

## Database Models

### User
- Stores authentication credentials
- Contains basic profile information
- Linked to role-specific profiles

### EntrepreneurProfile
- Startup information (name, funding needs)
- Industry, location, team size
- Auto-created on registration

### InvestorProfile
- Investment interests and stages
- Portfolio companies
- Investment range
- Auto-created on registration

## Troubleshooting

### Error: "MongoDB Connection Error: connect ECONNREFUSED"
- MongoDB service is not running
- Windows: Run `mongod.exe` from installation folder
- macOS: Run `brew services start mongodb-community`
- Linux: Run `sudo systemctl start mongod`

### Error: "Invalid token" (401)
- Token is missing from Authorization header
- Token has expired (request new one with refresh endpoint)
- Token doesn't match JWT_SECRET

### Error: "Port 5000 already in use"
- Another process is using port 5000
- Change PORT in `.env.local`
- Or kill the process: `lsof -ti:5000 | xargs kill -9` (macOS/Linux)

### Error: "CORS errors in browser"
- Check CORS_ORIGIN in `.env.local`
- Must include frontend URL (http://localhost:5173 for dev)
- Separate multiple origins with comma

### Slow Database Queries
- Database indexes missing
- Check MongoDB connection string
- Verify network connectivity for Atlas

## Development Tools

### ESLint (Code Quality)
```bash
npm run lint
```

### Prettier (Code Formatting)
```bash
npm run format
```

### Testing
```bash
npm test
npm run test:watch
```

## Production Deployment

### Build Backend
```bash
npm run build
```

Creates `dist/` folder with compiled JavaScript.

### Deploy to Hosting

**Heroku:**
```bash
heroku create nexus-backend
git push heroku main
heroku config:set MONGODB_URI=your_atlas_uri
```

**Railway:**
1. Create New Project
2. Deploy from GitHub
3. Set environment variables
4. Done!

**AWS EC2:**
1. Launch Node.js AMI
2. Clone repository
3. Run `npm install` and `npm start`
4. Configure security groups

**Google Cloud Run:**
```bash
gcloud run deploy nexus --runtime nodejs18 --allow-unauthenticated
```

## Security Checklist

- [ ] JWT_SECRET is strong (random 32+ chars)
- [ ] MONGODB_URI hidden in environment variables
- [ ] CORS_ORIGIN restricted to your frontend domain
- [ ] Password hashing working (bcryptjs)
- [ ] Input validation enabled on all routes
- [ ] HTTPS enforced in production
- [ ] Database backups configured
- [ ] Monitoring and logging enabled
- [ ] Rate limiting configured
- [ ] Error messages don't leak sensitive info

## Next Steps

1. **Implement Frontend-Backend Integration** (Milestone 3)
   - Connect authentication context
   - Integrate profile management
   - Add messaging system

2. **Add Advanced Features**
   - WebSocket for real-time messaging
   - File uploads (AWS S3)
   - Payment processing (Stripe)
   - Video calling (Agora/Twilio)

3. **Testing & Optimization**
   - API testing with Jest
   - Load testing
   - Database query optimization
   - Security audit

## Support & Resources

- Express.js Docs: https://expressjs.com
- MongoDB Docs: https://mongodb.com/docs
- JWT Docs: https://jwt.io
- Mongoose: https://mongoosejs.com

## Additional Documentation

- See `Milestone2.txt` for complete API specifications
- See `backend/README.md` for backend-specific documentation
- See `backend/.env.example` for all configuration options

---

Last Updated: 2026-04-14
