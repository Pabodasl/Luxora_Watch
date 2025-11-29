const express = require('express');
const router = express.Router();
const {
  getAllWatches,
  getWatchById,
  createWatch,
  updateWatch,
  deleteWatch
} = require('../controllers/watchController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getAllWatches);
router.get('/:id', getWatchById);

// Protected routes (Admin only)
router.post('/', auth, upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'colorImages', maxCount: 10 }
]), createWatch);

router.put('/:id', auth, upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'colorImages', maxCount: 10 }
]), updateWatch);

router.delete('/:id', auth, deleteWatch);

module.exports = router;
