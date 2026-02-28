const Batch = require('../models/Batch');

// @route   POST /api/batches
// @desc    Create a new batch
// @access  Admin only
const createBatch = async (req, res) => {
  try {
    const { batchName, startYear, endYear, department } = req.body;

    // Validate input
    if (!batchName || !startYear || !endYear || !department) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if batch already exists
    const existingBatch = await Batch.findOne({ batchName });
    if (existingBatch) {
      return res.status(400).json({
        success: false,
        message: 'Batch with this name already exists',
      });
    }

    // Create batch
    const batch = await Batch.create({
      batchName,
      startYear,
      endYear,
      department,
    });

    res.status(201).json({
      success: true,
      message: 'Batch created successfully',
      data: batch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/batches
// @desc    Get all batches
// @access  All authenticated users
const getBatches = async (req, res) => {
  try {
    const batches = await Batch.find().sort({ startYear: -1 });

    res.status(200).json({
      success: true,
      count: batches.length,
      data: batches,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/batches/:id
// @desc    Get single batch
// @access  All authenticated users
const getBatchById = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found',
      });
    }

    res.status(200).json({
      success: true,
      data: batch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   PUT /api/batches/:id
// @desc    Update batch
// @access  Admin only
const updateBatch = async (req, res) => {
  try {
    const { batchName, startYear, endYear, department, totalStudents } = req.body;

    let batch = await Batch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found',
      });
    }

    // Update fields if provided
    if (batchName) batch.batchName = batchName;
    if (startYear) batch.startYear = startYear;
    if (endYear) batch.endYear = endYear;
    if (department) batch.department = department;
    if (totalStudents !== undefined) batch.totalStudents = totalStudents;
    batch.updatedAt = Date.now();

    batch = await batch.save();

    res.status(200).json({
      success: true,
      message: 'Batch updated successfully',
      data: batch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   DELETE /api/batches/:id
// @desc    Delete batch
// @access  Admin only
const deleteBatch = async (req, res) => {
  try {
    const batch = await Batch.findByIdAndDelete(req.params.id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Batch deleted successfully',
      data: batch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createBatch,
  getBatches,
  getBatchById,
  updateBatch,
  deleteBatch,
};
