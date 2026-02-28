# SMS - Getting Started & Installation Guide

Welcome to the Student Management System! This guide will help you set up and run the project locally.

## System Requirements

Before you begin, make sure you have the following installed:

- **Node.js** (v14.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** (Local installation OR MongoDB Atlas account)
- **Git** (optional, for version control)
- **Postman** (optional, for API testing) - [Download](https://www.postman.com/downloads/)

### Check Installations

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check MongoDB (if installed locally)
mongod --version
```

---

## Installation Steps

### 1️⃣ Setup MongoDB

#### Option A: Local MongoDB
```bash
# Windows - Make sure MongoDB is installed
# Run MongoDB server in a separate terminal
mongod
```

#### Option B: MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Note: Update `MONGODB_URI` in `.env` file with this string

---

### 2️⃣ Backend Setup

Navigate to the backend folder and install dependencies:

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file from template
# On Windows (PowerShell):
Copy-Item .env.example -Destination .env

# On Mac/Linux:
cp .env.example .env
```

**Edit `.env` file** with your configuration:

```env
MONGODB_URI=mongodb://localhost:27017/sms_db
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

**Start the backend server:**

```bash
# Development mode with hot reload
npm run dev

# Or production mode
npm start
```

Expected output:
```
Server running on port 5000
Environment: development
MongoDB Connected: localhost
```

✅ Backend is now running on `http://localhost:5000`

---

### 3️⃣ Frontend Setup

In a new terminal, navigate to the frontend folder:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file (optional)
# Add: REACT_APP_API_URL=http://localhost:5000/api
```

**Start the frontend:**

```bash
npm start
```

The app will automatically open in your browser at `http://localhost:3000`

✅ Frontend is now running on `http://localhost:3000`

---

## Verify Installation

### Check Backend Health

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "SMS API Server is running",
  "timestamp": "2024-01-29T10:30:00.000Z"
}
```

### Check Frontend

Open browser: `http://localhost:3000` - You should see the login page

---

## Testing the API

### Option 1: Using Postman (Recommended)

1. **Import Collection:**
   - Open Postman
   - Click "Import"
   - Select `SMS-API-Collection.postman_collection.json`
   - Collection will be imported with all endpoints

2. **Set Environment Variables:**
   - Click "Environments"
   - Create new environment "SMS-Dev"
   - Set variables:
     - `base_url`: `http://localhost:5000`
     - `token`: (will be auto-filled after login)

3. **Test Endpoints:**
   - Start with "Register User"
   - Then "Login User" (token will be auto-saved)
   - Test other endpoints

### Option 2: Using cURL

```bash
# Register a new admin user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@test.com",
    "password": "admin123",
    "role": "Admin"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123"
  }'

# Copy the token from response and test protected endpoints
TOKEN="your_token_here"

curl -X GET http://localhost:5000/api/courses \
  -H "Authorization: Bearer $TOKEN"
```

### Option 3: Using Frontend UI

1. Go to `http://localhost:3000/login`
2. Register a new account:
   - Name: John Doe
   - Email: john@test.com
   - Password: password123
   - Role: Student (default)
3. Click "Register"


Password reset and Google Sign-In

- To enable password reset emails, add SMTP credentials to your backend `.env` (see `backend/.env.example`). The app uses `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASS` to send reset links.

- To enable Google Sign-In, create a Google OAuth Client ID and add it to both `frontend/.env` as `REACT_APP_GOOGLE_CLIENT_ID` and `backend/.env` as `GOOGLE_CLIENT_ID`. The app verifies Google ID tokens on the backend.

4. You'll be logged in and redirected to dashboard

---

## Test Users (Pre-created)

After registration, you can use these test accounts:

### Admin User
- Email: `admin@example.com`
- Password: `admin123`
- Role: Admin

### Student User
- Email: `student@example.com`
- Password: `student123`
- Role: Student

---

## Common Issues & Solutions

### Issue: "Cannot find module" error
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Issue: MongoDB Connection Error
**Solution:**
- Ensure MongoDB is running (`mongod` in separate terminal)
- Check `MONGODB_URI` in `.env`
- If using Atlas, verify:
  - Correct connection string
  - IP is whitelisted
  - Database/user credentials are correct

### Issue: Port 5000 already in use
**Solution:**
```bash
# Change PORT in .env to another port (e.g., 5001)
PORT=5001

# Or kill the process
# On Windows (PowerShell):
Get-Process -Name node | Stop-Process

# On Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

### Issue: Port 3000 already in use
**Solution:**
```bash
# Frontend will automatically use next available port
# Or set PORT environment variable:
PORT=3001 npm start
```

### Issue: CORS errors
**Solution:**
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Restart backend after changing `.env`

### Issue: Token errors when testing API
**Solution:**
- Make sure you copy token from login response
- Include full token (remove any extra quotes)
- Format: `Authorization: Bearer <token>`
- Token expires in 7 days by default

### Issue: Cannot POST to /api/students etc.
**Solution:**
- Make sure you're logged in (have valid token)
- Check that your user role has permission (Admin for POST)
- Verify `Authorization` header is included

---

## Project Folder Structure

```
SMS project/
│
├── backend/                    # Node.js/Express API
│   ├── config/                # Database config
│   ├── controllers/           # Route handlers
│   ├── middleware/            # Auth & role checks
│   ├── models/                # MongoDB schemas
│   ├── routes/                # API routes
│   ├── server.js             # Main server
│   ├── package.json          # Dependencies
│   ├── .env                  # Config (create from .env.example)
│   └── .gitignore
│
├── frontend/                   # React UI
│   ├── public/               # Static files
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API calls
│   │   ├── context/         # State management
│   │   ├── styles/          # CSS files
│   │   └── App.js          # Main component
│   ├── package.json         # Dependencies
│   └── .gitignore
│
├── README.md                 # Full documentation
├── QUICKSTART.md            # Setup guide (this file)
├── ARCHITECTURE.md          # System design
├── PROJECT_SUMMARY.md       # File structure
└── SMS-API-Collection.postman_collection.json  # API tests
```

---

## Development Workflow

### Terminal Setup
For smooth development, use multiple terminal windows:

1. **Terminal 1 - MongoDB:**
   ```bash
   mongod
   ```

2. **Terminal 2 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```

3. **Terminal 3 - Frontend:**
   ```bash
   cd frontend
   npm start
   ```

Now you can develop with hot reload enabled on all services!

---

## Running the Full Stack

### All at Once (Using npm-concurrently)

If you want to run both frontend and backend from one command:

**Install concurrently** (optional):
```bash
npm install -g concurrently
```

**Create start script in root** (optional):
```bash
# Add to package.json in root
{
  "scripts": {
    "start": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm start\""
  }
}
```

---

## Useful Commands

### Backend

```bash
# Install packages
npm install

# Start development server (with nodemon)
npm run dev

# Start production server
npm start

# List installed packages
npm list
```

### Frontend

```bash
# Install packages
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Git Commands

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit"

# Add remote repository
git remote add origin <your-repo-url>

# Push to repository
git push -u origin main
```

---

## Environment Variables Cheat Sheet

### Backend (.env)

| Variable | Default | Description |
|----------|---------|-------------|
| MONGODB_URI | mongodb://localhost:27017/sms_db | Database connection string |
| PORT | 5000 | Server port |
| NODE_ENV | development | Environment (development/production) |
| JWT_SECRET | change_me | Secret key for JWT signing |
| JWT_EXPIRE | 7d | Token expiration time |
| FRONTEND_URL | http://localhost:3000 | Frontend URL for CORS |

### Frontend (.env - optional)

| Variable | Default | Description |
|----------|---------|-------------|
| REACT_APP_API_URL | http://localhost:5000/api | Backend API URL |

---

## Next Steps After Setup

1. ✅ Test all API endpoints with Postman
2. ✅ Create test data (users, courses, students)
3. ✅ Test frontend functionality
4. ✅ Review and modify code as needed
5. ⏭️ Add more features (batch management, etc.)
6. ⏭️ Deploy to production

---

## Deployment Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Set `NODE_ENV` to `production`
- [ ] Use MongoDB Atlas (cloud) instead of local
- [ ] Enable HTTPS
- [ ] Update `FRONTEND_URL` to production URL
- [ ] Setup environment variables on hosting platform
- [ ] Test all APIs in production
- [ ] Setup monitoring and logging
- [ ] Backup database regularly

---

## Getting Help

### Check Logs
- **Backend errors**: Look in terminal running `npm run dev`
- **Frontend errors**: Check browser console (F12)
- **MongoDB errors**: Check MongoDB logs

### Documentation
- See [README.md](./README.md) for complete API documentation
- See [ARCHITECTURE.md](./ARCHITECTURE.md) for system design

### Common Resources
- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [JWT Guide](https://jwt.io/)

---

## Tips & Best Practices

✅ **DO:**
- Use environment variables for all secrets
- Create a `.env` file for each environment
- Add `.env` to `.gitignore`
- Test all endpoints before deploying
- Keep MongoDB running in background
- Use Postman for API testing
- Read error messages carefully

❌ **DON'T:**
- Don't commit `.env` file to git
- Don't use weak JWT secrets
- Don't hardcode URLs/ports
- Don't skip input validation
- Don't ignore error messages
- Don't test in production

---

## Success Checklist

When you've completed setup, you should be able to:

- [ ] Backend server runs without errors
- [ ] Frontend loads the login page
- [ ] Can register a new user
- [ ] Can login with credentials
- [ ] Can see admin dashboard if logged in as admin
- [ ] Can see student dashboard if logged in as student
- [ ] API health check returns success
- [ ] Postman collection shows all endpoints

If all checks pass, you're ready to develop! 🎉

---

## Support & Troubleshooting

For issues not covered here:

1. Check the error message carefully
2. Look in the browser console (F12) for frontend errors
3. Check backend terminal for API errors
4. Verify MongoDB connection
5. Restart services and try again
6. Review [README.md](./README.md) and [ARCHITECTURE.md](./ARCHITECTURE.md)

---

**Happy Coding!** 🚀

Feel free to customize and extend this project with additional features!
