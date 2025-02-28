const mongoose = require("mongoose");
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

async function createUser(userData) {
  try {
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    const user = new User(userData);
    return await user.save();
  } catch (error) {
    throw new Error("Error creating user: " + error.message);
  }
}

async function getAllUsers() {
  try {
    return await User.find();
  } catch (error) {
    throw new Error("Error fetching users: " + error.message);
  }
}

async function getUserById(userId) {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid User ID");
    }
    return await User.findById(userId);
  } catch (error) {
    throw new Error("Error fetching user by ID: " + error.message);
  }
}

async function getUserByEmail(email) {
  try {
    return await User.findOne({ email });
  } catch (error) {
    throw new Error("Error fetching user by email: " + error.message);
  }
}

async function updateUser(userId, userData) {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid User ID");
    }
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    return await User.findByIdAndUpdate(userId, userData, { new: true });
  } catch (error) {
    throw new Error("Error updating user: " + error.message);
  }
}

async function deleteUser(userId) {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid User ID");
    }
    return await User.findByIdAndDelete(userId);
  } catch (error) {
    throw new Error("Error deleting user: " + error.message);
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
};
