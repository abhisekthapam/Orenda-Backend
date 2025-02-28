const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ["admin", "waitress", "kitchen_staff"], default: "waitress" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
