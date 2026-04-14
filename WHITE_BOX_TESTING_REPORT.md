# White Box Testing Report - Nexus Backend

**Date**: April 15, 2026  
**Type**: White Box Testing (Logic Verification)  
**Scope**: Backend authentication, JWT utilities, middleware, and controller functions  

---

## What is White Box Testing?

White box testing examines the **internal logic** of code to verify:
1. Each function's logic is correct
2. Functions interact properly with each other
3. Data flows correctly between modules
4. Edge cases are handled appropriately

---

## Testing Summary

### ✅ What Works Correctly

**JWT Token Functions:**
- `generateToken(userId, role)` - Creates tokens with correct payload
- `generateRefreshToken(userId)` - Creates refresh tokens with longer expiration
- `decodeToken(token)` - Decodes tokens without verification
- Token claims include userId and role for authorization

**Authentication Middleware:**
- `authenticate(req, res, next)` - Correctly extracts Bearer token from header
- Token verification checks signature AND expiration
- User object properly attached to request for later use

**Controllers:**
- `login(req, res)` - Correctly verifies password using bcryptjs
- Password comparison is secure (time-constant comparison)
- Tokens generated with correct userId and role
- User online status updated on login

**Data Flows:**
1. **Password Flow**: Plain text → User model → bcryptjs hash → Database ✓
2. **User ID Flow**: user._id → JWT token → Decoded in requests → req.user.userId ✓
3. **Role Flow**: Register → User model → Token → Authorization checks ✓
4. **Token Flow**: Generated → Frontend stores → Sent in requests → Backend verifies ✓

**Security Aspects:**
- Password hashed with 10 salt rounds
- Token verification includes signature check
- Token expiration enforced (7 days by default)
- Role-based access control on each request

---

## ⚠️ Issues Found

### 1. **CRITICAL: Hardcoded JWT Secrets** 🔴

**Location**: `src/utils/jwt.ts` - `getJwtSecret()` and `getRefreshSecret()`

**Issue**:
```javascript
const getJwtSecret = (): string => {
  return process.env.JWT_SECRET || 'your_secret_key';  // ❌ HARDCODED DEFAULT
};
```

**Problem**:
- If JWT_SECRET environment variable is not set, uses hardcoded `'your_secret_key'`
- Any attacker knowing this key can forge valid tokens
- Violates security best practices

**Impact**: CRITICAL - Anyone can create fake tokens and impersonate users

**Fix Required**:
```javascript
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return secret;
};
```

---

### 2. **CRITICAL: No Transaction in User Registration** 🔴

**Location**: `src/controllers/authController.ts` - `register()`

**Issue**:
```
1. User created and saved ✓
2. Profile created and saved ✗ (might fail)
3. If profile save fails, tokens are still issued
```

**Problem**:
- User object saved to database
- Then profile created (EntrepreneurProfile or InvestorProfile)
- If profile save fails: User exists but profile doesn't
- Frontend gets tokens but cannot access profile data

**Impact**: CRITICAL - Data consistency issue, user cannot use account properly

**Fix Required**: Use MongoDB transactions:
```javascript
const session = await mongoose.startSession();
session.startTransaction();
try {
  await user.save({ session });
  await profile.save({ session });
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
}
```

---

### 3. **MINOR: Generic Error Messages** ⚠️

**Location**: `src/utils/jwt.ts` - `verifyToken()` and `verifyRefreshToken()`

**Issue**:
```javascript
catch (error: any) {
  throw new Error('Invalid token');  // ⚠️ Too generic
}
```

**Problem**:
- Cannot distinguish between:
  - Token expired (TokenExpiredError)
  - Token tampered (JsonWebTokenError)
  - Token malformed (can't parse)
- Makes debugging harder

**Impact**: MINOR - Affects debugging, but acceptable for security

---

### 4. **MINOR: Wrong HTTP Status Code** ⚠️

**Location**: `src/middleware/auth.ts` - `authorize()`

**Issue**:
```javascript
if (!req.user) {
  return res.status(401).json({  // ❌ Should be 403
    success: false,
    message: 'User not authenticated',
  });
}
```

**Problem**:
- Returns 401 (Unauthorized) when user not found
- Should return 403 (Forbidden) or require using `authenticate()` first
- Misleading HTTP status code

**Impact**: MINOR - Confusing API semantics, but works

---

## Function Interaction Analysis

### User Registration Flow ✓
```
POST /api/auth/register
  ├─ Validate input
  ├─ Check email not duplicate
  ├─ Create User (password hashed)
  ├─ Create Profile (EntrepreneurProfile OR InvestorProfile)
  ├─ Generate Access Token (includes userId, role)
  ├─ Generate Refresh Token (includes userId only)
  └─ Return tokens + user data (Status 201)
```
**Status**: WORKS (with data consistency risk noted above)

### User Login Flow ✓
```
POST /api/auth/login
  ├─ Validate email, password, role
  ├─ Find user with specific role
  ├─ Compare provided password with  hash
  ├─ Update isOnline = true
  ├─ Generate Access Token
  ├─ Generate Refresh Token
  └─ Return tokens (Status 200)
```
**Status**: CORRECT - Password comparison secure, tokens generated properly

### Protected Route Access ✓
```
GET /api/protected/route (with token)
  ├─ Extract token from Authorization header
  ├─ Verify token signature + expiration
  ├─ Attach user { userId, role } to request
  ├─ Check if user role in allowed roles
  ├─ Continue to controller if authorized
  └─ Return 401/403 if not authorized
```
**Status**: SECURE - Token verification works correctly

---

## Testing Methodology

This white box testing examined:

1. **Code Logic**: Does each function do what it's supposed to do?
   - JWT generation: ✅ Correct
   - Password comparison: ✅ Secure
   - Token verification: ✅ Works properly
   - Role checking: ✅ Implemented correctly

2. **Function Interactions**: Do functions work together properly?
   - register() → User model → Profile model → JWT generation: ✅ Connected
   - login() → password verify → JWT generation: ✅ Correct flow
   - authenticate() → authorize() → controller: ✅ Proper middleware chain

3. **Data Flows**: Does data move correctly between modules?
   - Password: Plain → Hash → Database: ✅ Correct
   - User ID: Generated → Token → Request: ✅ Works
   - Role: Registration → Token → Authorization: ✅ Verified

4. **Security**: Are security practices followed?
   - Password hashing: ✅ bcryptjs with salt rounds
   - Token signing: ⚠️ Hardcoded defaults (ISSUE #1)
   - Token verification: ✅ Signature + expiration
   - Authorization: ✅ Role-based access control

---

## Critical Issues Summary

| Issue | Severity | Location | Impact | Status |
|-------|----------|----------|--------|--------|
| Hardcoded JWT Secrets | CRITICAL | `utils/jwt.ts` | Token forgery possible | ❌ Needs Fix |
| No Transaction in Register | CRITICAL | `controllers/authController.ts` | User without profile | ❌ Needs Fix |
| Generic Error Messages | MINOR | `utils/jwt.ts` | Hard to debug | ⚠️ Optional |
| Wrong Status Code | MINOR | `middleware/auth.ts` | Misleading API | ⚠️ Optional |

---

## Recommendations

### Priority 1 (CRITICAL - Fix Before Production)
1. **Remove hardcoded JWT secrets**
   - Require environment variables for all secrets
   - Throw error if not provided
   
2. **Implement transaction handling in register()**
   - Use MongoDB transactions
   - Rollback on any failure
   - Ensure data consistency

### Priority 2 (IMPORTANT - Fix Soon)
3. **Improve error messages**
   - Distinguish token errors (expired vs invalid signature)
   - Better debugging information
   
4. **Fix HTTP status codes**
   - Use 403 for authorization failures
   - Use 401 for authentication failures

---

## Overall Assessment

**Status**: ✅ **FUNCTIONALLY CORRECT**

The backend logic is implemented correctly and follows proper authentication patterns. Token generation, verification, password hashing, and role-based access all work as expected.

However, there are **2 CRITICAL security/reliability issues** that must be fixed before production use:
1. Hardcoded JWT secrets (security risk)
2. No transaction handling (data consistency risk)

Once these issues are fixed, the authentication system will be secure and reliable.

---

## Files Involved

- `src/utils/jwt.ts` - Token generation and verification
- `src/middleware/auth.ts` - Request authentication and authorization
- `src/controllers/authController.ts` - User registration and login
- `src/models/User.ts` - User password hashing
- `src/models/EntrepreneurProfile.ts` - Entrepreneur profile
- `src/models/InvestorProfile.ts` - Investor profile

---

## Testing Date
April 15, 2026

## Test Type
White Box Testing - Internal Logic Verification

---
