# Nexus Backend

Backend API for the Nexus platform - Investor & Entrepreneur Collaboration Platform.

## Features

- JWT-based authentication
- Role-based access control (Entrepreneur & Investor)
- User registration and login
- User profile management with extended information
- MongoDB database integration
- Rate limiting and security headers
- Comprehensive API documentation
- Input validation with express-validator
- Error handling and logging

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- MongoDB (local or MongoDB Atlas)

Optional: Docker (to run MongoDB locally via docker-compose)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/mian-owais/Nexus-Platform.git
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create an `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nexus
JWT_SECRET=your_secure_secret_key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

## Development

Start the development server with hot reload:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`

Run MongoDB with Docker Compose (optional):

```bash
docker compose up -d
```

This starts MongoDB on `mongodb://localhost:27017` using `docker-compose.yml`.

## Building

Build the TypeScript to JavaScript:

```bash
npm run build
```

## Running in Production

```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Users

- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update user profile
- `GET /api/entrepreneurs` - Get all entrepreneurs
- `GET /api/investors` - Get all investors

### Profiles

- `GET /api/profile/entrepreneur/:id` - Get entrepreneur profile details
- `GET /api/profile/investor/:id` - Get investor profile details
- `PUT /api/profile/entrepreneur/:id` - Update entrepreneur profile
- `PUT /api/profile/investor/:id` - Update investor profile

## Database Models

### User Schema

- id (ObjectId)
- name (String)
- email (String, unique)
- password (String, hashed)
- role ('entrepreneur' | 'investor')
- avatarUrl (String)
- bio (String)
- isOnline (Boolean)
- createdAt (Date)
- updatedAt (Date)

### EntrepreneurProfile Schema

- userId (ObjectId, ref: User)
- startupName (String)
- pitchSummary (String)
- fundingNeeded (String)
- industry (String)
- location (String)
- foundedYear (Number)
- teamSize (Number)
- website (String)
- socialLinks (Object)

### InvestorProfile Schema

- userId (ObjectId, ref: User)
- investmentInterests (Array)
- investmentStage (Array)
- portfolioCompanies (Array)
- totalInvestments (Number)
- minimumInvestment (String)
- maximumInvestment (String)
- yearsOfExperience (Number)
- company (String)

## Authentication Flow

1. User registers with email and password
2. Password is hashed with bcryptjs (10 salt rounds)
3. User receives JWT token on successful login
4. Token includes user id, role, and expiration
5. Protected routes verify token in Authorization header
6. Role-based middleware ensures proper access

## Error Handling

All API errors return a standard error response:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (development only)"
}
```

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- CORS configuration
- Input validation and sanitization
- Environment variable protection
- Secure headers (Helmet recommended for production)

## Testing

Run tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test
```

## Linting & Formatting

Check code style:

```bash
npm run lint
```

Format code:

```bash
npm run format
```

## Environment Variables

See `.env.example` for all available configuration options.

## License

MIT

## Support

For issues and feature requests, please visit the GitHub repository.
