const Order = require("../models/orderModal");
const Product = require("../models/productModel");

exports.placeOrder = async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Invalid order data." });
        }

        let totalPrice = 0;

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ error: `Product not found: ${item.productId}` });
            }
            totalPrice += product.price * item.quantity;
        }

        const order = new Order({
            items,
            totalPrice,
        });

        await order.save();
        res.status(201).json({ message: "✅ Order placed successfully!", order });
    } catch (error) {
        console.error("❌ Error placing order:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("items.productId", "name price");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("items.productId", "name price");
        if (!order) return res.status(404).json({ error: "Order not found" });

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!order) return res.status(404).json({ error: "Order not found" });

        res.status(200).json({ message: "Order updated successfully!", order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ error: "Order not found" });

        res.status(200).json({ message: "Order deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
