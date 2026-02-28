# Student Management System - Project Instructions

## Project Overview
Full-stack Student Management System with:
- **Backend**: Node.js + Express + MongoDB
- **Frontend**: React
- **Authentication**: JWT with role-based access control
- **Main Features**: Admin manages students/courses, Students view profile and enrollments

## Setup Progress

### ✅ Step 1: Project Architecture Defined
- Backend API with JWT authentication
- Role-based middleware (Admin/Student)
- MongoDB collections: Users, Students, Courses, Batches, Enrollment
- REST APIs for CRUD operations

### ⏳ Step 2: Project Scaffolding
- [ ] Backend setup
- [ ] Frontend setup
- [ ] Database schemas
- [ ] API routes

### ⏳ Step 3: Core Implementation
- [ ] JWT authentication flow
- [ ] Role-based middleware
- [ ] API endpoints
- [ ] Database models

### ⏳ Step 4: Testing
- [ ] API testing with Postman
- [ ] Frontend integration
- [ ] End-to-end flows

## API Endpoints Reference
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/students` - Create student
- `GET /api/students` - List students
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `POST /api/courses` - Create course
- `GET /api/courses` - List courses
- `POST /api/enroll` - Enroll student in course
- `GET /api/enroll` - Get student enrollments

## Authentication Headers
All requests (except auth routes) require:
```
Authorization: Bearer <JWT_TOKEN>
```

## Role Permissions
- **Admin**: Create, read, update, delete users, students, courses
- **Student**: View own profile, view enrolled courses, view batch details
