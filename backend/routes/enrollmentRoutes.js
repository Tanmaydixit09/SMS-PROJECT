const express = require('express');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const {
  enrollStudent,
  getEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
} = require('../controllers/enrollmentController');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/', roleMiddleware(['Admin']), enrollStudent);
router.get('/', getEnrollments);
router.get('/:id', getEnrollmentById);
router.put('/:id', roleMiddleware(['Admin']), updateEnrollment);
router.delete('/:id', roleMiddleware(['Admin']), deleteEnrollment);

module.exports = router;
