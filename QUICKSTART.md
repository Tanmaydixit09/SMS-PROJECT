# Quick Start Guide - SMS Project

## Project Overview
This is a complete Student Management System with:
- **Backend API**: Node.js + Express + MongoDB
- **Frontend UI**: React with authentication
- **Authentication**: JWT-based with role-based access control
- **Roles**: Admin (manage everything) and Student (view profile & enrollments)

---

## Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Create `.env` file in backend folder:
```
MONGODB_URI=mongodb://localhost:27017/sms_db
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key_change_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

---

## Step 2: Start MongoDB
Make sure MongoDB is running on your system:

**Windows (if installed locally):**
```bash
mongod
```

**Or use MongoDB Atlas (Cloud)**
- Update `MONGODB_URI` in `.env` with your connection string

---

## Step 3: Start Backend Server

```bash
cd backend
npm run dev
```

Expected output:
```
Server running on port 5000
Environment: development
MongoDB Connected: localhost
```

---

## Step 4: Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## Step 5: Start Frontend Application

```bash
cd frontend
npm start
```

The app will automatically open at `http://localhost:3000`

---

## Step 6: Test the Application

### Create Test Users

**Using Postman** (Import `SMS-API-Collection.postman_collection.json`):

1. **Register Admin User:**
   ```
   POST http://localhost:5000/api/auth/register
   Body:
   {
     "name": "Admin User",
     "email": "admin@example.com",
     "password": "admin123",
     "role": "Admin"
   }
   ```

2. **Register Student User:**
   ```
   POST http://localhost:5000/api/auth/register
   Body:
   {
     "name": "Student User",
     "email": "student@example.com",
     "password": "student123",
     "role": "Student"
   }
   ```

3. **Login:**
   ```
   POST http://localhost:5000/api/auth/login
   Body:
   {
     "email": "admin@example.com",
     "password": "admin123"
   }
   ```
   Copy the token from response.

### Using the Frontend UI:

1. Go to `http://localhost:3000/login`
2. Login with email: `admin@example.com` and password: `admin123`
3. You'll see Admin Dashboard with options to manage students and courses
4. Or login with student credentials to see Student Dashboard

---

## Project Structure Summary

```
SMS project/
├── backend/                 # Express.js API
│   ├── models/             # MongoDB schemas
│   ├── controllers/        # Route handlers
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth, role checks
│   ├── config/             # Database config
│   ├── server.js          # Main server file
│   ├── package.json
│   └── .env               # Your secrets (create from .env.example)
│
├── frontend/              # React UI
│   ├── src/
│   │   ├── pages/         # Login, Dashboard
│   │   ├── components/    # Reusable components
│   │   ├── services/      # API calls
│   │   ├── context/       # Auth context
│   │   └── styles/        # CSS files
│   └── package.json
│
├── README.md              # Full documentation
├── SMS-API-Collection.postman_collection.json
└── QUICKSTART.md         # This file
```

---

## API Endpoints Summary

### Authentication (No token needed)
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Get JWT token

### Students (Admin only for create/update/delete)
- `POST /api/students` - Create
- `GET /api/students` - List all
- `GET /api/students/:id` - Get one
- `PUT /api/students/:id` - Update
- `DELETE /api/students/:id` - Delete

### Courses (Admin only for create/update/delete)
- `POST /api/courses` - Create
- `GET /api/courses` - List all
- `GET /api/courses/:id` - Get one
- `PUT /api/courses/:id` - Update
- `DELETE /api/courses/:id` - Delete

### Enrollments (Admin only for create/update/delete)
- `POST /api/enroll` - Enroll student
- `GET /api/enroll` - List
- `GET /api/enroll/:id` - Get one
- `PUT /api/enroll/:id` - Update grade
- `DELETE /api/enroll/:id` - Unenroll

---

## Common Issues & Solutions

### MongoDB Connection Error
- Ensure MongoDB is running (`mongod` in separate terminal)
- Check MONGODB_URI in `.env`
- If using MongoDB Atlas, ensure IP is whitelisted

### Port Already in Use
- Change PORT in `.env` (default 5000)
- Or kill the process using that port

### CORS Errors
- Ensure backend is running on port 5000
- Frontend proxy is set in `package.json`

### Token Errors
- Make sure to copy the token from login response
- Use format: `Authorization: Bearer <token>`
- Token expires in 7 days by default

---

## Next Steps

After setup is complete, you can:

1. **Add More Features:**
   - Student list management page
   - Course management page
   - Batch management system
   - Grade reports

2. **Improve Security:**
   - Add email verification
   - Implement refresh tokens
   - Add rate limiting

3. **Deploy:**
   - Backend to Heroku/Railway
   - Frontend to Vercel/Netlify
   - Database to MongoDB Atlas

4. **Enhancements:**
   - Add file uploads (profile pictures)
   - Export to PDF/Excel
   - Email notifications
   - Search and filter

---

## Support

For detailed API documentation, see [README.md](./README.md)

Happy coding! 🚀
