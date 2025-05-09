# Hey Students DU - Backend API

Backend server for the Hey Students DU platform, providing API endpoints for user management, alumni connections, accommodation listings, and referral tracking.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hey-students-du
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
ADMIN_JWT_EXPIRE=7d
```

3. Run the server:
- Development mode:
```bash
npm run dev
```
- Production mode:
```bash
npm start
```

## API Endpoints

### User Routes
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users/referrals` - Get user's referrals

### Admin Routes
- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/referrals` - Get all referrals in the system
- `POST /api/admin/create` - Create a new admin user
- `PUT /api/admin/accommodations/:id/verify` - Verify an accommodation listing

### Alumni Routes
- `GET /api/alumni` - Get all alumni
- `GET /api/alumni/:id` - Get a specific alumni
- `POST /api/alumni` - Create a new alumni (admin only)
- `PUT /api/alumni/:id` - Update an alumni (admin only)
- `DELETE /api/alumni/:id` - Delete an alumni (admin only)

### Accommodation Routes
- `GET /api/accommodations` - Get all accommodations
- `GET /api/accommodations/:id` - Get a specific accommodation
- `POST /api/accommodations` - Create a new accommodation (admin only)
- `PUT /api/accommodations/:id` - Update an accommodation (admin only)
- `DELETE /api/accommodations/:id` - Delete an accommodation (admin only)
- `POST /api/accommodations/:id/reviews` - Add a review to an accommodation

### Referral Routes
- `GET /api/referrals/validate/:code` - Validate a referral code
- `GET /api/referrals/my-code` - Get user's referral code
- `GET /api/referrals/referred-users` - Get users who used current user's referral code
- `GET /api/referrals/my-referrer` - Get who referred the current user
- `POST /api/referrals/generate-code` - Generate a new referral code

## Database Models

### User
- Personal info (name, email, password, mobile)
- Academic info (college, course, year)
- Role (user or admin)
- Referral tracking (referralCode, referredBy, referrals)

### Alumni
- Personal info (name, email)
- Academic background (college, graduationYear, course)
- Professional info (currentCompany, designation)
- Contact info (linkedInProfile)
- Mentorship availability

### Accommodation
- Basic info (name, type, description)
- Location (address, nearestCollege, nearestMetro)
- Details (rent, roomTypes, amenities, rules)
- Contact info
- Reviews
- Verification status

### Referral
- Tracks referrer and referred users
- Stores referral code used
- Tracks referral status 