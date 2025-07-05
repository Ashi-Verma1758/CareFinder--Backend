import Hospital from '../models/Hospital.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import  ApiError  from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import Bed from '../models/bed.model.js'

//Create/Register Hospital
export const createHospital = asyncHandler(async (req, res) => {
  const { name, address, city, state, pincode, phone, email } = req.body;

  // Restrict hospital-staff to only register 1 hospital
  if (req.user.role === 'hospital-staff') {
    const existingHospital = await Hospital.findOne({ registeredBy: req.user._id });
    if (existingHospital) {
      throw new ApiError(400, "You have already registered a hospital");
    }
  }

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


// Get All Hospitals (with optional approval filter)
export const getAllHospitals = asyncHandler(async (req, res) => {
  const { approved } = req.query;

  let filter = {};
  if (approved === 'true') filter.isApproved = true;
  if (approved === 'false') filter.isApproved = false;

  const hospitals = await Hospital.find(filter).sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, hospitals, "List of hospitals"));
});

//Get Hospital by ID
export const getHospitalById = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findById(req.params.id);
  console.log("Fetching hospital by ID:", req.params.id); 

  if (!hospital) {
    throw new ApiError(404, "Hospital not found");
  }

  res.status(200).json(new ApiResponse(200, hospital, "Hospital found"));
});

//Update Hospital
export const updateHospital = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findById(req.params.id);

  if (!hospital) throw new ApiError(404, "Hospital not found");

  // Optionally, restrict update access
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

// Approve Hospital (Admin Only)
export const approveHospital = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findById(req.params.id);

  if (!hospital) throw new ApiError(404, "Hospital not found");

  hospital.isApproved = true;
  await hospital.save();

  res.status(200).json(new ApiResponse(200, hospital, "Hospital approved"));
});

//Delete Hospital (Optional)
export const deleteHospital = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findById(req.params.id);

  if (!hospital) throw new ApiError(404, "Hospital not found");

  await hospital.deleteOne();
  res.status(200).json(new ApiResponse(200, null, "Hospital deleted"));
});
//Get Hospital for Logged-in Staff
export const getMyHospital = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Check if user is a hospital-staff
  if (req.user.role !== 'hospital-staff') {
    throw new ApiError(403, "Access denied");
  }

  const hospital = await Hospital.findOne({ registeredBy: userId });

  if (!hospital) {
    throw new ApiError(404, "No hospital registered by this staff");
  }

  res.status(200).json(new ApiResponse(200, hospital, "Hospital fetched successfully"));
});

export const searchHospitals = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ success: false, message: "Query parameter is missing" });
  }

  const regex = new RegExp(query, 'i');

  const hospitals = await Hospital.find({
    isApproved: true,
    $or: [
      { name: regex },
      { city: regex }
    ]
  });

  const hospitalWithBeds = await Promise.all(hospitals.map(async (hospital) => {
    const beds = await Bed.find({ hospital: hospital._id });
    return { hospital, beds };
  }));

  res.status(200).json({ success: true, data: hospitalWithBeds });
});
