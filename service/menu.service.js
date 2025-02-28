const mongoose = require("mongoose");
const Menu = require("../models/Menu.model");

// Create a new menu item in the database
async function createMenuItem(data) {
  try {
    const newItem = new Menu(data);
    return await newItem.save();
  } catch (error) {
    throw new Error("Error creating menu item: " + error.message);
  }
}

// Get all menu items from the database
async function getAllMenuItems() {
  try {
    return await Menu.find();
  } catch (error) {
    throw new Error("Error fetching menu items: " + error.message);
  }
}

// Get a menu item by ID from the database
async function getMenuItemById(id) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Menu ID");
    }
    return await Menu.findById(id);
  } catch (error) {
    throw new Error("Error fetching menu item: " + error.message);
  }
}

// Update a menu item by ID in the database
async function updateMenuItem(id, data) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Menu ID");
    }
    return await Menu.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    throw new Error("Error updating menu item: " + error.message);
  }
}

// Delete a menu item by ID from the database
async function deleteMenuItem(id) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Menu ID");
    }
    return await Menu.findByIdAndDelete(id);
  } catch (error) {
    throw new Error("Error deleting menu item: " + error.message);
  }
}

module.exports = {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
};
