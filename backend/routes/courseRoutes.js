const express = require('express');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/', roleMiddleware(['Admin']), createCourse);
router.get('/', getCourses);
router.get('/:id', getCourseById);
router.put('/:id', roleMiddleware(['Admin']), updateCourse);
router.delete('/:id', roleMiddleware(['Admin']), deleteCourse);

module.exports = router;
