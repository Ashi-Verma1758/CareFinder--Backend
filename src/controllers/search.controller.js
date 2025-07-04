import Hospital from '../models/Hospital.model.js';
import Bed from '../models/bed.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

//Search Hospitals by city, bed type & availability
export const searchHospitals = asyncHandler(async (req, res) => {
  const { city, bedType, minAvailableBeds = 1 } = req.query;

  // Get approved hospitals
  let hospitalFilter = { isApproved: true };
  if (city) hospitalFilter.city = { $regex: city, $options: 'i' };

  const hospitals = await Hospital.find(hospitalFilter);

  // beds matching hospital, bedType & availability
  const hospitalIds = hospitals.map(h => h._id);

  let bedFilter = {
    hospital: { $in: hospitalIds },
    availableBeds: { $gte: minAvailableBeds },
  };

  if (bedType) bedFilter.type = bedType;

  const beds = await Bed.find(bedFilter).populate('hospital');

  // data grouped by hospital
  const grouped = {};

  beds.forEach(bed => {
    const hid = bed.hospital._id.toString();
    if (!grouped[hid]) {
      grouped[hid] = {
        hospital: bed.hospital,
        beds: []
      };
    }
    grouped[hid].beds.push({
      type: bed.type,
      availableBeds: bed.availableBeds,
      totalBeds: bed.totalBeds
    });
  });

  const results = Object.values(grouped);

  res.status(200).json(new ApiResponse(200, results, "Search results"));
});
