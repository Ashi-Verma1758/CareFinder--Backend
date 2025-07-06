import Bed from '../models/bed.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import Hospital from '../models/Hospital.model.js';
//Add Bed
export const addBed = asyncHandler(async (req, res) => {
  let hospitalId = req.body.hospitalId;

  // If role is hospital-staff, override with their hospital
  if (req.user.role === 'hospital-staff' || 'admin') {
    const hospital = await Hospital.findOne({ registeredBy: req.user._id });
    if (!hospital) {
      throw new ApiError(404, "No hospital found for this user");
    }
    hospitalId = hospital._id;
  }

  const { type, totalBeds, availableBeds } = req.body;

  const bedExists = await Bed.findOne({ hospital: hospitalId, type });
  if (bedExists) {
    throw new ApiError(400, 'Bed type already exists for this hospital');
  }

  const bed = await Bed.create({
    hospital: hospitalId,
    type,
    totalBeds,
    availableBeds,
  });

  res.status(201).json(new ApiResponse(201, bed, 'Bed record added'));
});


//Update Bed
export const updateBed = asyncHandler(async (req, res) => {
  const { totalBeds, availableBeds } = req.body;
  const bed = await Bed.findById(req.params.id);

  if (!bed) throw new ApiError(404, 'Bed record not found');

  if (totalBeds !== undefined) bed.totalBeds = totalBeds;
  if (availableBeds !== undefined) bed.availableBeds = availableBeds;

  bed.lastUpdated = Date.now();

  await bed.save();
  res.status(200).json(new ApiResponse(200, bed, 'Bed record updated'));
});

//Get Beds by Hospital
export const getBedsByHospital = asyncHandler(async (req, res) => {
  const beds = await Bed.find({ hospital: req.params.hospitalId });
  res.status(200).json({ success: true, beds });
});

