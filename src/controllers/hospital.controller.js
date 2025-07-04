import Hospital from '../models/Hospital.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import  ApiError  from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

//Create/Register Hospital
export const createHospital = asyncHandler(async (req, res) => {
  const { name, address, city, state, pincode, phone, email } = req.body;

  const existing = await Hospital.findOne({ email });
  if (existing) {
    throw new ApiError(400, "Hospital with this email already exists");
  }

  const hospital = await Hospital.create({
    name,
    address,
    city,
    state,
    pincode,
    phone,
    email,
    registeredBy: req.user._id, 
  });

  res.status(201).json(new ApiResponse(201, hospital, "Hospital registered"));
});

//Get All Hospitals
export const getAllHospitals = asyncHandler(async (req, res) => {
  const { approved } = req.query;

  let filter = {};
  if (approved === 'true') filter.isApproved = true;
  if (approved === 'false') filter.isApproved = false;

  const hospitals = await Hospital.find(filter).sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, hospitals, "List of hospitals"));
});

// Get Hospital by ID
export const getHospitalById = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findById(req.params.id);

  if (!hospital) {
    throw new ApiError(404, "Hospital not found");
  }

  res.status(200).json(new ApiResponse(200, hospital, "Hospital found"));
});

//pdate Hospital
export const updateHospital = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findById(req.params.id);

  if (!hospital) throw new ApiError(404, "Hospital not found");

  // restrict update access
  if (!hospital.registeredBy.equals(req.user._id) && req.user.role !== 'admin') {
    throw new ApiError(403, "Not authorized to update this hospital");
  }

  const fields = ["name", "address", "city", "state", "pincode", "phone", "email"];
  fields.forEach((field) => {
    if (req.body[field]) hospital[field] = req.body[field];
  });

  await hospital.save();

  res.status(200).json(new ApiResponse(200, hospital, "Hospital updated"));
});

//Approve Hospital
export const approveHospital = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findById(req.params.id);

  if (!hospital) throw new ApiError(404, "Hospital not found");

  hospital.isApproved = true;
  await hospital.save();

  res.status(200).json(new ApiResponse(200, hospital, "Hospital approved"));
});

//Delete Hospital
export const deleteHospital = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findById(req.params.id);

  if (!hospital) throw new ApiError(404, "Hospital not found");

  await hospital.deleteOne();
  res.status(200).json(new ApiResponse(200, null, "Hospital deleted"));
});
