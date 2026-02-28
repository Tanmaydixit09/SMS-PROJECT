const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/database');
const User = require('../models/User');
const Batch = require('../models/Batch');
const Course = require('../models/Course');
const Student = require('../models/Student');
const Enrollment = require('../models/Enrollment');

const seed = async () => {
  try {
    await connectDB();

    // Create admin user
    let admin = await User.findOne({ email: 'admin@example.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'Admin',
      });
      console.log('Created admin user: admin@example.com / admin123');
    } else {
      console.log('Admin user already exists');
    }

    // Create student user
    let studentUser = await User.findOne({ email: 'student@example.com' });
    if (!studentUser) {
      studentUser = await User.create({
        name: 'Student User',
        email: 'student@example.com',
        password: 'student123',
        role: 'Student',
      });
      console.log('Created student user: student@example.com / student123');
    } else {
      console.log('Student user already exists');
    }

    // Create batch
    let batch = await Batch.findOne({ batchName: 'Batch A' });
    if (!batch) {
      batch = await Batch.create({ batchName: 'Batch A', startYear: 2022, endYear: 2026, department: 'Computer Science' });
      console.log('Created batch: Batch A');
    }

    // Create course
    let course = await Course.findOne({ code: 'CS101' });
    if (!course) {
      course = await Course.create({
        name: 'Introduction to Programming',
        code: 'CS101',
        description: 'Intro course',
        credits: 3,
        instructor: 'Dr. Smith',
        semester: 1,
        maxStudents: 100,
      });
      console.log('Created course: CS101');
    }

    // Create student profile
    let student = await Student.findOne({ userId: studentUser._id });
    if (!student) {
      student = await Student.create({
        userId: studentUser._id,
        rollNumber: 'STU001',
        batchId: batch._id,
        phoneNumber: '9876543210',
        address: '123 Main St',
        dateOfBirth: new Date('2003-01-15'),
      });
      console.log('Created student profile');
    }

    // Create enrollment
    let enrollment = await Enrollment.findOne({ studentId: student._id, courseId: course._id });
    if (!enrollment) {
      enrollment = await Enrollment.create({ studentId: student._id, courseId: course._id });
      console.log('Enrolled student in CS101');
    }

    console.log('Seeding complete');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
