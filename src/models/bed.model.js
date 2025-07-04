import mongoose from 'mongoose';

const bedSchema = new mongoose.Schema({
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true,
  },
  type: {
    type: String,
    enum: ['ICU', 'Ventilator', 'General', 'Oxygen'],
    required: true,
  },
  totalBeds: {
    type: Number,
    required: true,
  },
  availableBeds: {
    type: Number,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const Bed = mongoose.model('Bed', bedSchema);
export default Bed;
