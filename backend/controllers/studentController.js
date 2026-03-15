const Student = require('../models/Student');
const User = require('../models/User');
const Batch = require('../models/Batch');

// @route   POST /api/students
// @desc    Create a new student
// @access  Admin only
const createStudent = async (req, res) => {
  try {
    const { userId, rollNumber, batchId, phoneNumber, address, dateOfBirth } = req.body;

    // Validate input
    if (!userId || !rollNumber || !batchId || !phoneNumber || !address || !dateOfBirth) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ rollNumber });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this roll number already exists',
      });
    }

    // Create student and increment batch total
    const student = await Student.create({
      userId,
      rollNumber,
      batchId,
      phoneNumber,
      address,
      dateOfBirth,
    });

    // Increment batch totalStudents
    if (student.batchId) {
      await Batch.findByIdAndUpdate(student.batchId, { $inc: { totalStudents: 1 } });
    }

    await student.populate('userId batchId');

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/students
// @desc    Get all students
// @access  Admin and Students (students can only view their own)
const getStudents = async (req, res) => {
  try {
    let query = Student.find().populate('userId batchId');

    // If student role, only fetch their own profile
    if (req.user.role === 'Student') {
      query = query.where({ userId: req.user.id });
    }

    const students = await query;

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/students/:id
// @desc    Get single student
// @access  Admin and Student (own profile only)
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('userId batchId');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Check authorization
    if (req.user.role === 'Student' && student.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this student profile',
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   PUT /api/students/:id
// @desc    Update student
// @access  Admin only
const updateStudent = async (req, res) => {
  try {
    const { phoneNumber, address, status } = req.body;

    let student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Update fields if provided
    if (phoneNumber) student.phoneNumber = phoneNumber;
    if (address) student.address = address;
    if (status) student.status = status;
    student.updatedAt = Date.now();

    student = await student.save();
    await student.populate('userId batchId');

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   DELETE /api/students/:id
// @desc    Delete student
// @access  Admin only
const deleteStudent = async (req, res) => {
  try {
  const student = await Student.findById(req.params.id).populate('batchId');
  if (!student) {
    return res.status(404).json({
      success: false,
      message: 'Student not found',
    });
  }

  // Decrement batch totalStudents
  if (student.batchId) {
    await Batch.findByIdAndUpdate(student.batchId._id, { $inc: { totalStudents: -1 } });
  }

  await Student.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
