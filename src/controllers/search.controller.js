import Hospital from '../models/Hospital.model.js';
import Bed from '../models/bed.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

//Search Hospitals by city, bed type & availability
export const searchHospitals = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ success: false, message: 'Query is required' });
  }

  const hospitals = await Bed.aggregate([
    {
      $lookup: {
        from: 'hospitals',
        localField: 'hospital',
        foreignField: '_id',
        as: 'hospital'
      }
    },
    { $unwind: '$hospital' },
    {
      $match: {
        $or: [
          { 'hospital.name': { $regex: query, $options: 'i' } },
          { 'hospital.city': { $regex: query, $options: 'i' } }
        ],
        'hospital.isApproved': true
      }
    },
    {
      $group: {
        _id: '$hospital._id',
        hospital: { $first: '$hospital' },
        beds: { $push: '$$ROOT' }
      }
    }
  ]);

  res.status(200).json({ success: true, data: hospitals });
});

