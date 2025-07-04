import express from 'express';
import {
  addBed,
  updateBed,
  getBedsByHospital,
} from '../controllers/bed.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = express.Router();

router.post('/', requireAuth, authorizeRoles('admin', 'hospital-staff'), addBed);
router.put('/:id', requireAuth, authorizeRoles('admin', 'hospital-staff'), updateBed);
router.get('/:hospitalId', getBedsByHospital);

export default router;
