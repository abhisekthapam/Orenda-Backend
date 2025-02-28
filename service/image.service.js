const mongoose = require("mongoose");
const Image = require("../models/Image.model");

// Create a new image in the database
async function createImage(data) {
  try {
    const newImage = new Image(data);
    return await newImage.save();
  } catch (error) {
    throw new Error("Error creating image: " + error.message);
  }
}

// Get an image by ID from the database
async function getImageById(id) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Image ID");
    }
    return await Image.findById(id);
  } catch (error) {
    throw new Error("Error fetching image: " + error.message);
  }
}

// Delete an image by ID from the database
async function deleteImage(id) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Image ID");
    }
    return await Image.findByIdAndDelete(id);
  } catch (error) {
    throw new Error("Error deleting image: " + error.message);
  }
}

// Update an image in the database
async function updateImage(id, data) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Image ID");
    }
    return await Image.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    throw new Error("Error updating image: " + error.message);
  }
}

module.exports = { createImage, updateImage, getImageById, deleteImage };
