const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    //  required: true
  },
  password: {
    type: String,
    //  required: true
  },

  country: {
    type: String,
    //  required: true
  },
  state: {
    type: String,
    //   required: true
  },
  city: {
    type: String,
    //  required: true
  },
  pincode: {
    type: String,
    //  required: true
  },
  address: {
    type: String,
    //  required: true
  },
  otp: { type: String,
    default: null 
   },
  otpExpiry: { type: Number, 
   default: null },

  date: {
    type: Date,
    default: Date.now,
  },
   isVerified: {
      type: Boolean,//email-sent status
      default: false,
   },
   isActive: {
      type: Boolean,//after verification status
      default: false,
   },

   user_role: {
      type: String,
      enum: ["user", "admin","superadmin"],
      default: "user",
   },

   profile:{
    type:String,
   },
     provider:  { type: String, enum: ["local", "google", "facebook"], default: "local" },
  facebookId:{ type: String, index: true }

});

const User = new mongoose.model("User", userSchema);

module.exports = User;
