import express from 'express';
import {
  addBed,
  updateBed,
  getBedsByHospital,
} from '../controllers/bed.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = express.Router();
router.get('/:hospitalId', getBedsByHospital);

router.post('/', requireAuth, authorizeRoles('admin', 'hospital-staff'), addBed);
router.put('/:id', requireAuth, authorizeRoles('admin', 'hospital-staff'), updateBed);

export default router;
