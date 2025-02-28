const mongoose = require("mongoose");
const OrderItem = require("../models/OrderItem.model"); // Assuming you have an OrderItem model

// Create multiple OrderItems
const createOrderItem = async (orderItems) => {
  try {
    const createdItems = await OrderItem.insertMany(orderItems);
    return createdItems;
  } catch (error) {
    throw new Error("Error creating order items: " + error.message);
  }
};

// Get all OrderItems for a specific order
const getAllOrderItemsForOrder = async (orderId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new Error("Invalid Order ID");
    }
    
    return await OrderItem.find({ orderId }).populate("menuItem");
  } catch (error) {
    throw new Error("Error fetching order items: " + error.message);
  }
};

// Get a single OrderItem by ID
const getOrderItemById = async (orderItemId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(orderItemId)) {
      throw new Error("Invalid Order Item ID");
    }

    return await OrderItem.findById(orderItemId);
  } catch (error) {
    throw new Error("Error fetching order item: " + error.message);
  }
};

// Update an OrderItem quantity
const updateOrderItemQuantity = async (orderItemId, newQuantity) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(orderItemId)) {
      throw new Error("Invalid Order Item ID");
    }

    return await OrderItem.findByIdAndUpdate(
      orderItemId,
      { Quantity: newQuantity },
      { new: true }
    );
  } catch (error) {
    throw new Error("Error updating order item quantity: " + error.message);
  }
};

// Delete an OrderItem
const deleteOrderItem = async (orderItemId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(orderItemId)) {
      throw new Error("Invalid Order Item ID");
    }

    return await OrderItem.findByIdAndDelete(orderItemId);
  } catch (error) {
    throw new Error("Error deleting order item: " + error.message);
  }
};

module.exports = {
  createOrderItem,
  getAllOrderItemsForOrder,
  getOrderItemById,
  updateOrderItemQuantity,
  deleteOrderItem,
};
