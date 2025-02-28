const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
  imagesId: { type: mongoose.Schema.Types.ObjectId, ref: "Image", required: false },
}, { timestamps: true });

module.exports = mongoose.model("Menu", MenuSchema);
