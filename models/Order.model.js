const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  TableID: { type: Number, required: true },
  Total: { type: Number, required: true },
  Status: { type: String, enum: ["PENDING", "CONFIRMED", "CANCELLED"], default: "PENDING" },
  OrderedItems: [
    {
      menuId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
      Quantity: { type: Number, required: true },
    },
  ],
  OrderDateTime: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
