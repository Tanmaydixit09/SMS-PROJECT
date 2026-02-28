const express = require('express');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/', roleMiddleware(['Admin']), createStudent);
router.get('/', getStudents);
router.get('/:id', getStudentById);
router.put('/:id', roleMiddleware(['Admin']), updateStudent);
router.delete('/:id', roleMiddleware(['Admin']), deleteStudent);

module.exports = router;
