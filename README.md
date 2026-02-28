# Student Management System (SMS)

A comprehensive full-stack web application for managing students, courses, batches, and enrollments with JWT-based authentication and role-based access control.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Database Models](#database-models)

## Features

### Admin Features
- Manage student records (create, read, update, delete)
- Create and manage courses
- Manage student enrollments
- Assign grades and track enrollment status
- View comprehensive dashboards

### Student Features
- Register and login
- View personal profile and information
- See enrolled courses
- Track enrollment status and grades
- Secure authentication with JWT tokens

### Security Features
- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control (Admin/Student)
- Protected API endpoints
- CORS support

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Environment Variables**: dotenv
- **CORS**: cors
- **Validation**: express-validator

### Frontend
- **Library**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS3

## Project Structure

```
SMS project/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── courseController.js
│   │   └── enrollmentController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── role.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Course.js
│   │   ├── Batch.js
│   │   └── Enrollment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── courseRoutes.js
│   │   └── enrollmentRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── PrivateRoute.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── StudentDashboard.js
│   │   │   └── AdminDashboard.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── styles/
│   │   │   ├── Auth.css
│   │   │   └── Dashboard.css
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   └── package.json
│
└── .github/
    └── copilot-instructions.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configuration:
   ```
   MONGODB_URI=mongodb://localhost:27017/sms_db
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:3000
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (optional):
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

## API Endpoints

### Authentication Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | User login |

### Student Routes (Protected)
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/api/students` | Create student | Admin |
| GET | `/api/students` | List all students | Admin/Student* |
| GET | `/api/students/:id` | Get student by ID | Admin/Student* |
| PUT | `/api/students/:id` | Update student | Admin |
| DELETE | `/api/students/:id` | Delete student | Admin |

*Students can only view their own profile

### Course Routes (Protected)
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/api/courses` | Create course | Admin |
| GET | `/api/courses` | List all courses | All |
| GET | `/api/courses/:id` | Get course by ID | All |
| PUT | `/api/courses/:id` | Update course | Admin |
| DELETE | `/api/courses/:id` | Delete course | Admin |

### Enrollment Routes (Protected)
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/api/enroll` | Enroll student in course | Admin |
| GET | `/api/enroll` | Get enrollments | Admin/Student* |
| GET | `/api/enroll/:id` | Get enrollment by ID | Admin/Student* |
| PUT | `/api/enroll/:id` | Update enrollment/grade | Admin |
| DELETE | `/api/enroll/:id` | Unenroll student | Admin |

*Students see only their own enrollments

## Authentication

### JWT Flow

1. **Registration**: User registers with name, email, and password
   - Password is hashed using bcryptjs
   - User is saved to MongoDB
   - JWT token is generated and returned

2. **Login**: User logs in with email and password
   - Email is verified in the database
   - Password is compared with stored hash
   - JWT token is generated and returned

3. **Token Usage**: 
   - Token is stored in localStorage on the frontend
   - Token is sent in the `Authorization` header for all protected requests
   - Format: `Authorization: Bearer <token>`

4. **Token Verification**:
   - Backend verifies token signature using JWT_SECRET
   - Token expiration is checked
   - User information is extracted from token payload

### Request Example
```bash
curl -X GET http://localhost:5000/api/students \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Database Models

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['Admin', 'Student'], default: 'Student'),
  createdAt: Date (default: Date.now)
}
```

### Student Schema
```javascript
{
  userId: ObjectId (ref: User, unique),
  rollNumber: String (required, unique),
  batchId: ObjectId (ref: Batch),
  phoneNumber: String (required),
  address: String (required),
  dateOfBirth: Date (required),
  enrollmentDate: Date (default: Date.now),
  status: String (enum: ['Active', 'Inactive', 'Graduated'], default: 'Active'),
  createdAt: Date,
  updatedAt: Date
}
```

### Course Schema
```javascript
{
  name: String (required, unique),
  code: String (required, unique),
  description: String (required),
  credits: Number (1-4, required),
  instructor: String (required),
  semester: Number (required),
  maxStudents: Number (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Batch Schema
```javascript
{
  batchName: String (required, unique),
  startYear: Number (required),
  endYear: Number (required),
  totalStudents: Number (default: 0),
  department: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Enrollment Schema
```javascript
{
  studentId: ObjectId (ref: Student),
  courseId: ObjectId (ref: Course),
  enrollmentDate: Date (default: Date.now),
  status: String (enum: ['Active', 'Completed', 'Dropped'], default: 'Active'),
  grade: String (enum: ['A', 'B', 'C', 'D', 'F', 'Incomplete'], default: 'Incomplete'),
  createdAt: Date,
  updatedAt: Date
}
```

## Testing with Postman

1. Import the provided Postman collection
2. Set the `base_url` variable to `http://localhost:5000`
3. Authenticate by calling `/api/auth/login`
4. Copy the token from the response
5. Set the `Authorization` header with `Bearer <token>`
6. Test the API endpoints

## Error Handling

All API responses follow a standard format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## Common Error Codes
- `400`: Bad Request - Invalid input
- `401`: Unauthorized - Missing or invalid token
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource not found
- `500`: Server Error - Internal server error

## Development Notes

- MongoDB must be running before starting the backend
- Update JWT_SECRET in production
- Change FRONTEND_URL according to your deployment
- Use environment variables for sensitive data
- CORS is enabled for localhost:3000 by default

## Next Steps

1. Add more dashboard components (student list, course management, etc.)
2. Implement batch management routes
3. Add input validation on the frontend
4. Create PDF/Excel export functionality
5. Add email notifications
6. Implement search and filter features
7. Add user profile update functionality
8. Create attendance tracking system

## License

This project is open source and available under the MIT License.
