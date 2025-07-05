import express from 'express';
const router = express.Router();
import Hospital from '../models/Hospital.model.js';
import {
  createHospital,
  getAllHospitals,
  getHospitalById,
  updateHospital,
  approveHospital,
  getMyHospital,
  searchHospitals,
  deleteHospital
} from '../controllers/hospital.controller.js';

import { requireAuth } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';


// Add the routes like this:
router.post('/', requireAuth, authorizeRoles('admin', 'hospital-staff'), createHospital);

router.get('/', getAllHospitals);
router.get('/search', searchHospitals); 

router.get('/:id', getHospitalById);
router.put('/:id', requireAuth, updateHospital);
router.put('/approve/:id', requireAuth, authorizeRoles('admin'), approveHospital);
router.get('/my-hospital', requireAuth, authorizeRoles('hospital-staff'), getMyHospital);


router.delete('/:id', requireAuth, authorizeRoles('admin'), deleteHospital);

export default router;
