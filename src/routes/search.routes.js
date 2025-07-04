import express from 'express';
const router = express.Router();
import { searchHospitals } from '../controllers/search.controllers.js';


router.get('/', searchHospitals);

export default router;
