const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a course name'],
    trim: true,
    unique: true,
  },
  code: {
    type: String,
    required: [true, 'Please provide a course code'],
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  credits: {
    type: Number,
    required: true,
    min: 1,
    max: 4,
  },
  instructor: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
  },
  maxStudents: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Course', courseSchema);
