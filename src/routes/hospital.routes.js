import express from 'express';
const router = express.Router();
import {
  createHospital,
  getAllHospitals,
  getHospitalById,
  updateHospital,
  approveHospital,
  deleteHospital
} from '../controllers/hospital.controllers.js';

import { requireAuth } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';


// Add the routes like this:
router.post('/', requireAuth, authorizeRoles('admin', 'hospital-staff'), createHospital);

router.get('/', getAllHospitals);
router.get('/:id', getHospitalById);
router.put('/:id', requireAuth, updateHospital);
router.put('/approve/:id', requireAuth, authorizeRoles('admin'), approveHospital);
router.delete('/:id', requireAuth, authorizeRoles('admin'), deleteHospital);

export default router;
