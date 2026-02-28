const Enrollment = require('../models/Enrollment');
const Student = require('../models/Student');
const Course = require('../models/Course');

// @route   POST /api/enroll
// @desc    Enroll student in a course
// @access  Admin only
const enrollStudent = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    // Validate input
    if (!studentId || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide studentId and courseId',
      });
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ studentId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Student is already enrolled in this course',
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      studentId,
      courseId,
    });

    await enrollment.populate('studentId courseId');

    res.status(201).json({
      success: true,
      message: 'Student enrolled successfully',
      data: enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/enroll
// @desc    Get enrollments
// @access  Admin and Students (students see their own)
const getEnrollments = async (req, res) => {
  try {
    let query = Enrollment.find().populate('studentId courseId');

    // If student role, only fetch their own enrollments
    if (req.user.role === 'Student') {
      const student = await Student.findOne({ userId: req.user.id });
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student profile not found',
        });
      }
      query = query.where({ studentId: student._id });
    }

    const enrollments = await query;

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/enroll/:id
// @desc    Get single enrollment
// @access  Admin and Student (own enrollment only)
const getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id).populate('studentId courseId');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      });
    }

    // Check authorization
    if (req.user.role === 'Student') {
      const student = await Student.findOne({ userId: req.user.id });
      if (!student || enrollment.studentId._id.toString() !== student._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this enrollment',
        });
      }
    }

    res.status(200).json({
      success: true,
      data: enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   PUT /api/enroll/:id
// @desc    Update enrollment (grade, status)
// @access  Admin only
const updateEnrollment = async (req, res) => {
  try {
    const { grade, status } = req.body;

    let enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      });
    }

    // Update fields if provided
    if (grade) enrollment.grade = grade;
    if (status) enrollment.status = status;
    enrollment.updatedAt = Date.now();

    enrollment = await enrollment.save();
    await enrollment.populate('studentId courseId');

    res.status(200).json({
      success: true,
      message: 'Enrollment updated successfully',
      data: enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   DELETE /api/enroll/:id
// @desc    Delete enrollment (unenroll)
// @access  Admin only
const deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student unenrolled successfully',
      data: enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  enrollStudent,
  getEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
};
