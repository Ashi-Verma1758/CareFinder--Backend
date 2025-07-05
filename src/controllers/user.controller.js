import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// 🔐 Helper to generate and send tokens
export const sendTokens = (user, res) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Set refresh token as HttpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Send response
  return res.status(200).json(
  new ApiResponse(200, {
    accessToken,
    user: {
      id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  }, "Login successful")
);

};

//Register
export const registerUser = asyncHandler(async (req, res) => {
  const { username, fullName, email, password, role } = req.body;

  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    throw new ApiError(400, "Username or email already exists");
  }

  try{const user = await User.create({
    username,
    fullName,
    email,
    password,
    role
  });

  sendTokens(user, res);
}catch(err){
  console.error("🔥 registerUser error:", err);
  res.status(500).json({ message: "Registration failed", error: err.message });
}
});

//Login
export const loginUser = asyncHandler(async (req, res) => {
  const { emailOrUsername, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
  });

  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, "Invalid email/username or password");
  }

  sendTokens(user, res);
});

//Refresh Access Token
export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    throw new ApiError(401, "Refresh token not found");
  }

  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, "User not found");
  }

  const newAccessToken = user.generateAccessToken();
  res.status(200).json(
    new ApiResponse(200, { accessToken: newAccessToken }, "Access token refreshed")
  );
});

//Logout
export const logoutUser = asyncHandler(async (req, res, next) => {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.status(200).json({
      success: true,
      message: "User successfully logged out"
    });
  
});


