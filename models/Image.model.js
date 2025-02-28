const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: false },
}, { timestamps: true });

// Prevent model overwrite error
module.exports = mongoose.models.Image || mongoose.model("Image", ImageSchema);
