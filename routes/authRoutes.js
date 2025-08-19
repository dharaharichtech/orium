const express = require('express');
const router = express.Router();
const {register, login, mailSend, verifyOtp, resetPassword, getAllUsers, getUserById, updateUser, verifyEmail} = require("../controller/authController")
const upload = require('../utils/multer');

//user register routes
router.post("/register", upload.single("profile"), register);

//user login routes
router.post("/login",login)

//user verify email routes
router.get("/verify-email/:token", verifyEmail);

//user verify otp routes
router.post("/verify-otp",verifyOtp);

//user email-send routes
router.post("/mail-send",mailSend);

//user reset password routes
router.patch("/reset-password",resetPassword);

//get all users routes
router.get("/allusers",getAllUsers)

//get users by id routes
router.get("/allusers/:id",getUserById);

//update user routes
router.patch("/update/:id",updateUser);

module.exports = router;