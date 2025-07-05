import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: String,
  city: String,
  state: String,
  pincode: String,
  phone: String,
  email: String,
  registeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Hospital = mongoose.model('Hospital', hospitalSchema);
export default Hospital;


