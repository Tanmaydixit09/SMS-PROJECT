const Course = require('../models/Course');

// @route   POST /api/courses
// @desc    Create a new course
// @access  Admin only
const createCourse = async (req, res) => {
  try {
    const { name, code, description, credits, instructor, semester, maxStudents } = req.body;

    // Validate input
    if (!name || !code || !description || !credits || !instructor || !semester || !maxStudents) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if course already exists
    const existingCourse = await Course.findOne({ $or: [{ code }, { name }] });
    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: 'Course with this code or name already exists',
      });
    }

    // Create course
    const course = await Course.create({
      name,
      code,
      description,
      credits,
      instructor,
      semester,
      maxStudents,
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/courses
// @desc    Get all courses
// @access  All authenticated users
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ semester: 1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/courses/:id
// @desc    Get single course
// @access  All authenticated users
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Admin only
const updateCourse = async (req, res) => {
  try {
    const { name, description, credits, instructor, maxStudents } = req.body;

    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Update fields if provided
    if (name) course.name = name;
    if (description) course.description = description;
    if (credits) course.credits = credits;
    if (instructor) course.instructor = instructor;
    if (maxStudents) course.maxStudents = maxStudents;
    course.updatedAt = Date.now();

    course = await course.save();

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   DELETE /api/courses/:id
// @desc    Delete course
// @access  Admin only
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
