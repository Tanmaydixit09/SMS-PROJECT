const express = require('express');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const {
  createBatch,
  getBatches,
  getBatchById,
  updateBatch,
  deleteBatch,
} = require('../controllers/batchController');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/', roleMiddleware(['Admin']), createBatch);
router.get('/', getBatches);
router.get('/:id', getBatchById);
router.put('/:id', roleMiddleware(['Admin']), updateBatch);
router.delete('/:id', roleMiddleware(['Admin']), deleteBatch);

module.exports = router;
