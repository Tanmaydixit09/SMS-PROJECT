# SMS API Documentation

Complete reference for all Student Management System API endpoints.

---

## Base URL

```
http://localhost:5000/api
```

---

## Authentication

All endpoints (except `/auth/register` and `/auth/login`) require the following header:

```
Authorization: Bearer <JWT_TOKEN>
```

### Getting a Token

1. Call `/auth/login` or `/auth/register`
2. Extract `token` from response
3. Include in `Authorization` header for subsequent requests

---

## Response Format

### Success Response (200, 201)

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "count": 0
}
```

### Error Response (400, 401, 403, 404, 500)

```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Authentication Endpoints

### 1. Register User

**Endpoint:** `POST /auth/register`

**Access:** Public (No token required)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Student"  // Optional, default: "Student"
}
```

**Required Fields:**
- `name` - String, 1-50 characters
- `email` - Valid email, unique
- `password` - String, minimum 6 characters
- `role` - Enum: "Admin" or "Student" (optional)

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Student"
  }
}
```

**Error Cases:**
- `400` - Missing fields or invalid input
- `400` - Email already registered

---

### 2. Login User

**Endpoint:** `POST /auth/login`

**Access:** Public (No token required)

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Required Fields:**
- `email` - Valid email
- `password` - Correct password

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Student"
  }
}
```

**Error Cases:**
- `400` - Missing email or password
- `401` - Invalid credentials (wrong email/password)

---

## Student Endpoints

### 3. Create Student

**Endpoint:** `POST /students`

**Access:** Admin only (requires token)

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "rollNumber": "CS001",
  "batchId": "507f1f77bcf86cd799439012",
  "phoneNumber": "9876543210",
  "address": "123 Main St, City, State 12345",
  "dateOfBirth": "2002-01-15"
}
```

**Required Fields:**
- `userId` - Valid user ID
- `rollNumber` - Unique roll number
- `batchId` - Valid batch ID
- `phoneNumber` - Valid phone number
- `address` - Student's address
- `dateOfBirth` - Date in YYYY-MM-DD format

**Response (201):**
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "rollNumber": "CS001",
    "batchId": {
      "_id": "507f1f77bcf86cd799439012",
      "batchName": "2020-2024 CSE"
    },
    "phoneNumber": "9876543210",
    "address": "123 Main St, City, State 12345",
    "dateOfBirth": "2002-01-15",
    "status": "Active",
    "enrollmentDate": "2024-01-29T10:30:00.000Z"
  }
}
```

**Error Cases:**
- `400` - Missing required fields
- `400` - Duplicate roll number
- `401` - No token provided
- `403` - Not an admin
- `404` - User or batch not found

---

### 4. Get All Students

**Endpoint:** `GET /students`

**Access:** Admin (all students), Student (only self)

**Query Parameters:** None

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "userId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe"
      },
      "rollNumber": "CS001",
      "status": "Active"
    }
  ]
}
```

**Error Cases:**
- `401` - No token provided
- `401` - Invalid or expired token

---

### 5. Get Student by ID

**Endpoint:** `GET /students/:id`

**Access:** Admin (any student), Student (only self)

**Parameters:**
- `id` - Student ID (MongoDB ObjectId)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": {...},
    "rollNumber": "CS001",
    "batchId": {...},
    "phoneNumber": "9876543210",
    "address": "123 Main St",
    "dateOfBirth": "2002-01-15",
    "status": "Active",
    "enrollmentDate": "2024-01-29T10:30:00.000Z"
  }
}
```

**Error Cases:**
- `401` - No token
- `403` - Student trying to access others' profile
- `404` - Student not found

---

### 6. Update Student

**Endpoint:** `PUT /students/:id`

**Access:** Admin only

**Parameters:**
- `id` - Student ID

**Request Body (all optional):**
```json
{
  "phoneNumber": "9876543211",
  "address": "456 Oak Ave, City",
  "status": "Inactive"
}
```

**Updatable Fields:**
- `phoneNumber` - Student's phone number
- `address` - Student's address
- `status` - Enum: "Active", "Inactive", "Graduated"

**Response (200):**
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "phoneNumber": "9876543211",
    "address": "456 Oak Ave, City",
    "status": "Inactive",
    "updatedAt": "2024-01-29T10:35:00.000Z"
  }
}
```

**Error Cases:**
- `401` - No token
- `403` - Not an admin
- `404` - Student not found

---

### 7. Delete Student

**Endpoint:** `DELETE /students/:id`

**Access:** Admin only

**Parameters:**
- `id` - Student ID

**Response (200):**
```json
{
  "success": true,
  "message": "Student deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "rollNumber": "CS001"
  }
}
```

**Error Cases:**
- `401` - No token
- `403` - Not an admin
- `404` - Student not found

---

## Course Endpoints

### 8. Create Course

**Endpoint:** `POST /courses`

**Access:** Admin only

**Request Body:**
```json
{
  "name": "Data Structures",
  "code": "CS201",
  "description": "Study of data structures and algorithms",
  "credits": 4,
  "instructor": "Dr. Smith",
  "semester": 2,
  "maxStudents": 60
}
```

**Required Fields:**
- `name` - Unique course name
- `code` - Unique course code
- `description` - Course description
- `credits` - Number 1-4
- `instructor` - Instructor name
- `semester` - Semester number
- `maxStudents` - Maximum enrollment

**Response (201):**
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "name": "Data Structures",
    "code": "CS201",
    "description": "Study of data structures and algorithms",
    "credits": 4,
    "instructor": "Dr. Smith",
    "semester": 2,
    "maxStudents": 60,
    "createdAt": "2024-01-29T10:30:00.000Z"
  }
}
```

---

### 9. Get All Courses

**Endpoint:** `GET /courses`

**Access:** All authenticated users

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "name": "Data Structures",
      "code": "CS201",
      "credits": 4,
      "semester": 2
    }
  ]
}
```

---

### 10. Get Course by ID

**Endpoint:** `GET /courses/:id`

**Access:** All authenticated users

**Response (200):** Returns full course details

---

### 11. Update Course

**Endpoint:** `PUT /courses/:id`

**Access:** Admin only

**Request Body (optional fields):**
```json
{
  "name": "Advanced Data Structures",
  "description": "Advanced algorithms",
  "credits": 4,
  "instructor": "Dr. Jones",
  "maxStudents": 50
}
```

**Response (200):** Returns updated course

---

### 12. Delete Course

**Endpoint:** `DELETE /courses/:id`

**Access:** Admin only

**Response (200):** Returns deleted course

---

## Enrollment Endpoints

### 13. Enroll Student

**Endpoint:** `POST /enroll`

**Access:** Admin only

**Request Body:**
```json
{
  "studentId": "507f1f77bcf86cd799439013",
  "courseId": "507f1f77bcf86cd799439020"
}
```

**Required Fields:**
- `studentId` - Valid student ID
- `courseId` - Valid course ID

**Response (201):**
```json
{
  "success": true,
  "message": "Student enrolled successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439030",
    "studentId": {
      "_id": "507f1f77bcf86cd799439013",
      "rollNumber": "CS001"
    },
    "courseId": {
      "_id": "507f1f77bcf86cd799439020",
      "name": "Data Structures",
      "code": "CS201"
    },
    "enrollmentDate": "2024-01-29T10:30:00.000Z",
    "status": "Active",
    "grade": "Incomplete"
  }
}
```

**Error Cases:**
- `400` - Student already enrolled in this course
- `404` - Student or course not found

---

### 14. Get All Enrollments

**Endpoint:** `GET /enroll`

**Access:** Admin (all), Student (own only)

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439030",
      "studentId": {...},
      "courseId": {...},
      "status": "Active",
      "grade": "Incomplete"
    }
  ]
}
```

---

### 15. Get Enrollment by ID

**Endpoint:** `GET /enroll/:id`

**Access:** Admin, or Student (own enrollment only)

**Response (200):** Returns full enrollment details

---

### 16. Update Enrollment

**Endpoint:** `PUT /enroll/:id`

**Access:** Admin only

**Request Body (optional):**
```json
{
  "grade": "A",
  "status": "Completed"
}
```

**Valid Grades:** "A", "B", "C", "D", "F", "Incomplete"  
**Valid Status:** "Active", "Completed", "Dropped"

**Response (200):** Returns updated enrollment

---

### 17. Delete Enrollment

**Endpoint:** `DELETE /enroll/:id`

**Access:** Admin only

**Response (200):**
```json
{
  "success": true,
  "message": "Student unenrolled successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439030"
  }
}
```

---

## Health Check

### 18. API Health Status

**Endpoint:** `GET /health`

**Access:** Public (No token required)

**Response (200):**
```json
{
  "success": true,
  "message": "SMS API Server is running",
  "timestamp": "2024-01-29T10:30:00.000Z"
}
```

---

## Error Codes Reference

| Code | Name | Description |
|------|------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input or missing fields |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Internal server error |

---

## Rate Limiting

Currently not implemented. Add in production:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api', limiter);
```

---

## Data Validation

### Email Format
```
Valid: user@example.com
Valid: john.doe@company.co.uk
Invalid: userexample.com
Invalid: user@.com
```

### Password Requirements
- Minimum 6 characters
- No maximum length

### Phone Number
- Format: 10 digits (9876543210)
- Can include country code

### Date Format
```
Format: YYYY-MM-DD
Example: 2002-01-15
```

---

## Authentication Token Structure

JWT tokens contain:

```javascript
{
  "id": "507f1f77bcf86cd799439011",      // User ID
  "role": "Admin",                        // User role
  "iat": 1675075800,                      // Issued at
  "exp": 1675680600                       // Expires at
}
```

**Token Expiration:** 7 days from issue

---

## Common Use Cases

### 1. Complete User Registration Flow

```bash
# Step 1: Register
POST /auth/register
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secure123",
  "role": "Admin"
}

# Step 2: Extract token from response
# token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Step 3: Use token for subsequent requests
GET /students
Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Create Student and Enroll in Course

```bash
# Step 1: Create course (Admin)
POST /courses
{
  "name": "Physics 101",
  "code": "PHY101",
  ...
}

# Step 2: Create batch (requires batch endpoint - not shown)
# Step 3: Create student (Admin)
POST /students
{
  "userId": "<student_user_id>",
  "rollNumber": "PHY001",
  "batchId": "<batch_id>",
  ...
}

# Step 4: Enroll student in course (Admin)
POST /enroll
{
  "studentId": "<student_id>",
  "courseId": "<course_id>"
}

# Step 5: Assign grade (Admin)
PUT /enroll/<enrollment_id>
{
  "grade": "A",
  "status": "Completed"
}
```

### 3. Student Views Their Enrollments

```bash
# Login as student
POST /auth/login
{
  "email": "jane@example.com",
  "password": "secure123"
}

# Get own enrollments (automatically filtered to student's enrollments)
GET /enroll
Header: Authorization: Bearer <student_token>
```

---

## Testing with Examples

### Postman Example

1. **Create environment with variables:**
   - `base_url` = `http://localhost:5000`
   - `token` = (empty, will be filled)
   - `admin_id` = (ObjectId of admin user)

2. **Test request:**
   ```
   POST {{base_url}}/api/auth/login
   Content-Type: application/json

   {
     "email": "admin@example.com",
     "password": "admin123"
   }
   ```

3. **Set token in pre-request script:**
   ```javascript
   pm.environment.set("token", pm.response.json().token);
   ```

---

## Best Practices

1. **Always include token** in protected endpoints
2. **Check token expiration** and refresh before using
3. **Validate input** before sending requests
4. **Use HTTPS** in production
5. **Don't expose token** in public code/logs
6. **Set strong JWT_SECRET** in production
7. **Implement refresh tokens** for long sessions
8. **Add request logging** for debugging
9. **Monitor rate limiting** if implemented
10. **Regular security updates** to dependencies

---

For more information, see [README.md](./README.md) and [ARCHITECTURE.md](./ARCHITECTURE.md)
