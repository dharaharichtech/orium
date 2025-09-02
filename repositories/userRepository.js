const User = require("../model/userSchema");

const saveUserRepo = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const getAllUser = async()=> {
    return await User.find();
};

const getUserById = async (id)=>{
    return await User.findById(id);
}

const deleteAllUser = async()=> {
  return await User.deleteMany({})
}
const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const getUserByPhone = async (phone) => {
  return await User.findOne({ phone });
};

const findByEmail = (email) => {
  return User.findOne({ email });
};
const findByPhone = (phone) => {
  return User.findOne({ phone });
};


const findById = (id) => {
  return User.findById(id);
};

const findByIdExcludingPasswords = (id) => {
  return User.findById(id, "-password -confirm_password");
};

const findAllExcludingPasswords = () => {
  return User.find({}, "-password -confirm_password");
};

const createUser = (userData) => {
  return User.create(userData);
};

const updateById = (id, updates, options = {}) => {
  return User.findByIdAndUpdate(id, updates, { new: true, ...options });
};

const saveUser = (user) => {
  return user.save();
};

const getLastUser = async () => {
  return await User.findOne({ user_role: "user" }) 
    .sort({ uid: -1 })
    .lean();
};

const softDeleteUser = async (id) => {
  try {
    const deletedUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: 0,
        deleted_at: new Date()
      },
      { new: true }
    );

    return deletedUser;
  } catch (error) {
    console.error("Error in softDeleteUser:", error);
    throw error;
  }
};

module.exports = {softDeleteUser,getLastUser,findByPhone,saveUserRepo, getAllUser,getUserById, deleteAllUser , getUserByEmail,getUserByPhone,saveUser,updateById,createUser,findAllExcludingPasswords, findByIdExcludingPasswords,findById,findByEmail}; 


