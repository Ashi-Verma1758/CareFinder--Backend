import mongoose from 'mongoose';

const facilitySchema = new mongoose.Schema({
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true,
  },
  ambulanceAvailable: {
    type: Boolean,
    default: false,
  },
  oxygenAvailable: {
    type: Boolean,
    default: false,
  },
  covidTesting: {
    type: Boolean,
    default: false,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  }
});

const Facility = mongoose.model('Facility', facilitySchema);
export default Facility;
