const mongoose = require("mongoose");
const mapRequestBodyToImage = require("../utils/mapper");
const deleteFile = require("../utils/file.delete");
const imageService = require("../service/image.service");
const { imageSchema } = require("../validator/image.schema.validator");

// Create a new image
async function createImage(req, res) {
  try {
    const imageDataRequest = { name: req.body.name };
    const imageData = await mapRequestBodyToImage(imageDataRequest, imageSchema);
    const imageFile = await imageService.createImage(imageData);
    res.status(201).json({ imageFile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update an image
async function updateImage(req, res) {
  try {
    const imageId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(imageId)) {
      return res.status(400).json({ error: "Invalid Image ID" });
    }
    const imageDataRequest = { name: req.body.name };
    const imageData = await mapRequestBodyToImage(imageDataRequest, imageSchema);
    const file = await imageService.getImageById(imageId);
    if (file) deleteFile(file.name);
    const imageFile = await imageService.updateImage(imageId, imageData);
    res.status(200).json({ imageFile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { createImage, updateImage };
