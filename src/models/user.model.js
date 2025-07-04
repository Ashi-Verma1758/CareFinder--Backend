import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'hospital-staff', 'viewer'],
    default: 'viewer',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
},{timestamps: true});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
    { id: this._id, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
}


userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
}


const User = mongoose.model('User', userSchema);
export default User;
