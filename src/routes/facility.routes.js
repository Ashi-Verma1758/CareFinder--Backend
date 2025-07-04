import express from 'express';
import { upsertFacility, getFacility } from '../controllers/facility.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = express.Router();

router.post('/', requireAuth, authorizeRoles('admin', 'hospital-staff'), upsertFacility);
router.get('/:hospitalId', getFacility);

export default router;
