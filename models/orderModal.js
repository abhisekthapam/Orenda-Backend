const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: { type: Number, required: true, min: 1 },
        },
    ],
    totalPrice: { type: Number, required: true },
    status: {
        type: String,
        enum: ["Pending", "Completed", "Cancelled"],
        default: "Pending",
    },
    createdAt: { type: Date, default: Date.now },
});

OrderSchema.index({ createdAt: 1 });

module.exports = mongoose.model("Order", OrderSchema);
