import express from 'express';
const router = express.Router();
// import { searchHospitals } from '../controllers/search.controllers.js';
import { searchHospitals } from '../controllers/search.controller.js'

router.get('/search', searchHospitals);


export default router;
