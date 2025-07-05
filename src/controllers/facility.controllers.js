import Facility from '../models/facility.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ApiError  from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

//Add or update facilities for a hospital
export const upsertFacility = asyncHandler(async (req, res) => {
  const { hospitalId, ambulanceCount, oxygenCylinders, ventilators } = req.body;

  let facility = await Facility.findOne({ hospital: hospitalId });

  if (facility) {
    if (ambulanceCount !== undefined) facility.ambulanceCount = ambulanceCount;
    if (oxygenCylinders !== undefined) facility.oxygenCylinders = oxygenCylinders;
    if (ventilators !== undefined) facility.ventilators = ventilators;
    facility.lastUpdated = Date.now();
    await facility.save();
    return res.status(200).json(new ApiResponse(200, facility, "Facility updated"));
  }

  facility = await Facility.create({
    hospital: hospitalId,
    ambulanceCount,
    oxygenCylinders,
    ventilators,
  });

  res.status(201).json(new ApiResponse(201, facility, "Facility created"));
});

//Get facility for a hospital
export const getFacility = asyncHandler(async (req, res) => {
  const { hospitalId } = req.params;
  const facility = await Facility.findOne({ hospital: hospitalId }).populate("hospital");

  if (!facility) throw new ApiError(404, "Facility not found");

  res.status(200).json(new ApiResponse(200, facility, "Facility data"));
});
