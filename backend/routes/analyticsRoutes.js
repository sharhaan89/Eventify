import express from 'express';
import {
  getEventBasicStats,
  getGenderDistribution,
  getBranchDistribution,
  getYogDistribution,
  getCheckinTimeDistribution,
  getComprehensiveAnalytics
} from '../controllers/analyticsController.js';

const router = express.Router();

// Basic event statistics
router.get('/:eventId/stats', getEventBasicStats);

// Distribution endpoints
router.get('/:eventId/distribution/gender', getGenderDistribution);
router.get('/:eventId/distribution/branch', getBranchDistribution);
router.get('/:eventId/distribution/yog', getYogDistribution);

// Check-in time distribution
router.get('/:eventId/checkin-distribution', getCheckinTimeDistribution);

// Comprehensive analytics (all data in one call)
router.get('/:eventId/analytics', getComprehensiveAnalytics);

export default router;