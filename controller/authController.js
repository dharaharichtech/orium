const User = require("../model/userSchema");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/authValidation");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const sendEmail = require("../utils/sendEmail");
const userService = require("../services/userServices");

const register = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      phone,
      password,
      confirm_password,
      country,
      state,
      city,
      pincode,
      address,
      user_role,
      
    } = req.body;

    // Required fields check
    if (!firstname?.trim() || !lastname?.trim() || !email?.trim()) {
      return res
        .status(400)
        .json({ msg: "Please fill all the required fields" });
    }

    // Email  validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    // Phone  validation (if provided)
    const phoneRegex = /^\d{10}$/;
    if (phone && !phoneRegex.test(phone)) {
      return res.status(400).json({ msg: "Invalid phone number format" });
    }

    // Password  validation (if provided)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (password && !passwordRegex.test(password)) {
      return res.status(400).json({
        msg: "Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      });
    }

    // Passwords match
    if ((password || confirm_password) && password !== confirm_password) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    // Email already exists check
    const userExist = await userService.getUserByEmail(email);
    if (userExist) {
      return res.status(400).json({ msg: "Email already exists" });
    }
    // Phone already exists check
    const phoneExist = phone ? await userService.getUserByPhone(phone) : null;
    if (phoneExist) {
      return res.status(400).json({ msg: "Phone number already exists" });
    }

    let profilePic = null;
    if (req.file) {
      const serverUrl = `${req.protocol}://${req.get("host")}`;
      profilePic = `${serverUrl}/uploads/${req.file.filename}`;
    }

    // Hash password if provided
    let hash_password;
    if (password) {
      hash_password = await bcrypt.hash(password, 10);
    }

    

    const userData = {
      firstname,
      lastname,
      email,
      phone,
      password: hash_password,
      confirm_password,
      country,
      state,
      city,
      pincode,
      address,
      user_role:user_role || "user",
      profile:profilePic,
      isVerified: false, // default false
    };

    const userCreated = await userService.serviceCreateUser(userData);

    const token = jwt.sign({userId: userCreated._id},
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    )

    const verificationLink = `${process.env.PUBLIC_URL}/verify-email/${token}`
     const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Email Verification</h2>
        <p>Hi ${firstname},</p>
        <p>Thank you for registering. Please click the button below to verify your email:</p>
        <a href="${verificationLink}" 
           style="background-color: #4CAF50; color: white; padding: 10px 20px; 
                  text-decoration: none; border-radius: 5px; display: inline-block;">
           Verify Email
        </a>
        <p>This link will expire in 15 minutes.</p>
      </div>
    `;

    await sendEmail({
        to: email,
        subject: "verify your email",
        text:`Please verify your email by clicking the link below: ${verificationLink}`,
        html: htmlContent,
    })

    res.status(201).json({
      msg: "Registration complete",
      userCreated,
      userId: userCreated._id.toString(),
    });
  } catch (error) {
    console.error("Error in Registration:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};


 const verifyEmail = async(req,res)=>{
    try {
        const {token} = req.params;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // const user = await User.findByIdAndUpdate(decoded.userId,{isVerified:true}, {new:true});
         const user = await userService.updateUserById(decoded.userId, { isVerified: true });
        if(!user) {
            return res.status(404).json({msg:"User not found"});
        }
        res.status(200).json({msg:"Email verified successfully", user});
        
    } catch (error) {
        console.error("Error in verifyEmail:", error);
        res.status(500).json({ msg: "Internal Server Error" });
        
    }
 }

const login = async (req, res) => {
  try {
    const { email, password,phone } = req.body;

    if ((!email?.trim() && !phone ) || !password) {
      return res.status(400).json({ msg: "Please fill all the fields" });
    }

    const user = await userService.findByEmailOrPhone(email,phone)

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = generateToken(user._id.toString());

    res
      .status(200)
      .json({ msg: "Login successful", userId: user._id.toString(), token });
  } catch (error) {
    console.error("Error in Login:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    // const users = await User.find({}, "-password -confirm_password"); // remove password

    const users = await userService.getAllUsersExcludingPasswords()

    if (!users || users.length === 0) {
      return res.status(404).json({ msg: "No users found" });
    }

    res.status(200).json({ msg: "Users retrieved successfully", users });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserByIdExcludingPasswords(id)

    // const user = await User.findById(id, "-password -confirm_password"); // remove password fields
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json({ msg: "User retrieved successfully", user });
  } catch (error) {
    console.error("Error in getUserById:", error);
  }
};

const mailSend = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email?.trim()) return res.status(400).json({ msg: "Please provide an email" });

    const result = await userService.generateOtpAndSendEmail(email, sendEmail);
    if (!result.success) {
      return res.status(500).json({ msg: "Failed to send email", error: result.error });
    }

    res.status(200).json({ msg: "Email sent successfully" });
  } catch (error) {
    console.error("Error in mailSend:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email?.trim() || !otp?.trim()) {
      return res.status(400).json({ msg: "Please provide email and OTP" });
    }

    const result = await userService.verifyUserOtp(email, otp);
    if (!result.success) return res.status(400).json({ msg: result.message });

    res.status(200).json({ msg: "OTP verified successfully" });
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirm_password } = req.body;

    if (!email?.trim() || !newPassword?.trim()) {
      return res.status(400).json({ msg: "Please provide email and new password" });
    }
    if (newPassword !== confirm_password) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    const result = await userService.resetUserPassword(email, newPassword);
    if (!result.success) return res.status(400).json({ msg: result.message });

    res.status(200).json({ msg: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const result = await userService.updateUserDetails(id, updates);
    if (!result.success) return res.status(400).json({ msg: result.message });

    res.status(200).json({ msg: "User updated successfully", user: result.user });
  } catch (error) {
    console.error("Error in updateUser:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
const contactUs = async (req, res) => {
  try {
    const { name, email, message, phone } = req.body;

    if (!name?.trim() || !email?.trim() || !phone?.trim() || !message?.trim()) {
      return res.status(400).json({ msg: "Please fill all the fields" });
    }

    const userMailResponse = await sendEmail({
      from: process.env.EMAIL,
      to: email,
      subject: `Thank you for contacting Harich Tech - ${name}`,
      text: `Hi ${name},\n\nThank you for contacting Harich Tech. We will get back to you soon!\n\nYour details:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
      html: `
        <p>Hi <b>${name}</b>,</p>
        <p>Thank you for contacting <b>Harich Tech</b>. We will get back to you soon!</p>
        <br/>
        <h4>Your Details:</h4>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    if (!userMailResponse.success) {
      return res.status(500).json({ msg: "Failed to send thank you email", error: userMailResponse.error });
    }

    const adminMailResponse = await sendEmail({
      from: process.env.EMAIL,
      to: process.env.EMAIL, 
      subject: `New Contact Form Submission - ${name}`,
      text: `New message received:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    if (!adminMailResponse.success) {
      return res.status(500).json({ msg: "Failed to send admin email", error: adminMailResponse.error });
    }

    res.status(200).json({ msg: "Contact message sent successfully" });

  } catch (error) {
    console.error("Error in contactUs:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await userService.softDeleteUserById(id);
    if (!result.success) {
      return res.status(400).json({ msg: result.message });
    }

    res.status(200).json({ msg: "User blocked successfully" });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const verifyToken = (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ msg: "Token expired or invalid" });
      }

      // Convert Unix timestamps to readable dates
      const issuedAt = new Date(decoded.iat * 1000).toISOString();
      const expiresAt = new Date(decoded.exp * 1000).toISOString();

      res.status(200).json({
        msg: "Token is valid",
        user: {
          userId: decoded.userId,
          iat: decoded.iat,
          exp: decoded.exp,
          issuedAt,  // human-readable format
          expiresAt, // human-readable format
        },
      });
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};


module.exports = {
  verifyToken,
  deleteUser,
  contactUs,
  register,
  login,
  mailSend,
  verifyOtp,
  resetPassword,
  getAllUsers,
  getUserById,
  updateUser,
  verifyEmail
};
