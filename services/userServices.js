const  userRepository  = require("../repositories/userRepository");

 const serviceCreateUser = async (userData) => {
  return await userRepository.saveUserRepo(userData);
};

const getAllUser = async()=>{
return await userRepository.getAllUser()
}

const deleteAllUser = async()=>{
  return await userRepository.deleteAllUser();
};


const getUserByPhone = async (phone) => {
  return await userRepository.getUserByPhone(phone);
};

const updateUserById = async (id, updates) => {
  return await userRepository.updateById(id, updates, {
    new: true,
    select: "-password -confirm_password",
  });
};

const getUserByEmail = async(email)=>{
  return await userRepository.findByEmail(email)
}
const findByEmailOrPhone = async(email,phone)=>{
  if(email){
    return await userRepository.findByEmail(email)
  }
  if(phone){
    return await userRepository.findByPhone(phone)
}
return null;
}
const getAllUsersExcludingPasswords = async () => {
  return await userRepository.findAllExcludingPasswords();
};

const getUserByIdExcludingPasswords = async (id) => {
  return await userRepository.findByIdExcludingPasswords(id);
};

const generateOtpAndSendEmail = async (email, sendEmail) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    return { success: false, message: "Email not registered" };
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = Date.now() + 5 * 60 * 1000;

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await userRepository.saveUser(user);

  const emailResponse = await sendEmail({
    to: email,
    subject: "Your OTP Verification Code",
    text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
  });

  if (!emailResponse.success) {
    return { success: false, error: emailResponse.error };
  }

  return { success: true };
};

const verifyUserOtp = async (email, otp) => {
  const user = await userRepository.findByEmail(email);
  if (!user) return { success: false, message: "User not found" };

  if (user.otp !== otp) return { success: false, message: "Invalid OTP" };

  if (user.otpExpiry && user.otpExpiry < Date.now()) {
    return { success: false, message: "OTP expired" };
  }

  user.otp = null;
  user.otpExpiry = null;
  await userRepository.saveUser(user);

  return { success: true };
};

const resetUserPassword = async (email, newPassword) => {
  const user = await userRepository.findByEmail(email);
  if (!user) return { success: false, message: "User not found" };

  const saltRounds = 10;
  const hash_password = await bcrypt.hash(newPassword, saltRounds);

  user.password = hash_password;
  await userRepository.saveUser(user);

  return { success: true };
};

const updateUserDetails = async (id, updates) => {
  // email validation
  if (updates.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updates.email)) {
      return { success: false, message: "Invalid email format" };
    }
    const existingUser = await userRepository.findByEmail(updates.email);
    if (existingUser && existingUser._id.toString() !== id) {
      return { success: false, message: "Email already exists" };
    }
  }

  // Phone validation
  if (updates.phone) {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(updates.phone)) {
      return { success: false, message: "Invalid phone number format" };
    }
  }

  if (updates.password) {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(updates.password)) {
      return {
        success: false,
        message:
          "Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      };
    }
    if (updates.password !== updates.confirm_password) {
      return { success: false, message: "Passwords do not match" };
    }
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  delete updates.confirm_password;

  const user = await userRepository.updateById(id, updates, {
    new: true,
    runValidators: true,
    select: "-password -confirm_password",
  });

  if (!user) return { success: false, message: "User not found" };

  return { success: true, user };
};


module.exports = { serviceCreateUser, getAllUser, deleteAllUser ,getUserByEmail,getUserByPhone,  updateUserById,getUserByEmail,
  getAllUsersExcludingPasswords,getUserByIdExcludingPasswords,generateOtpAndSendEmail,verifyUserOtp,resetUserPassword,
  updateUserDetails,findByEmailOrPhone }; 