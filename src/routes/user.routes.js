import express from 'express';

import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser
} from "../controllers/user.controller.js";
const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/refresh", refreshToken);

router.get("/logout", logoutUser);

export default router;


