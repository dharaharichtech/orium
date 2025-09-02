const express = require('express');
const router = express.Router();
const {register, login, mailSend, verifyOtp, resetPassword, getAllUsers, getUserById, updateUser, verifyEmail, contactUs, deleteUser, verifyToken} = require("../controller/authController")
const upload = require('../utils/multer');
const passport = require('passport');
const { authenticate } = require('../utils/authValidation');

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

router.post("/contact-us", contactUs);

router.delete("/delete/:id", authenticate, deleteUser);

router.get("/verify-token",  verifyToken);

/////// google 


 router.get("/google",passport.authenticate("google",{scope:["profile","email"]}))

// router.get(
//   "/google/callback",
//   passport.authenticate("google", { failureRedirect: "/signin" }),
//   (req, res) => {
//     const jwt = require("jsonwebtoken");
//     const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
//       expiresIn: "9h",
//     });

//     // res.redirect(`${process.env.PUBLIC_URL}/signin?token=${token}`);
//     res.redirect(`${process.env.PUBLIC_URL}/auth-success?token=${token}`);
//   }
// );

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/signin" }),
  (req, res) => {
    const jwt = require("jsonwebtoken");
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: "9h" });
    res.redirect(`${process.env.PUBLIC_URL}/auth-success?token=${token}`);
  }
);





router.get("/facebook", passport.authenticate("facebook", { scope: [] }));



router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/signin" }),
  (req, res) => {
    const jwt = require("jsonwebtoken");
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "9h",
    });

    res.redirect(`${process.env.PUBLIC_URL}/auth-success?token=${token}`);
  }
);



module.exports = router;