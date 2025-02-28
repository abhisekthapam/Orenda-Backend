const mongoose = require("mongoose");
const WebSocket = require("ws");
const EventEmitter = require("events");
const Order = require("../models/Order.model");

const orderEmitter = new EventEmitter();

const orderService = {
  async createOrder(orderData, wss) {
    try {
      const createdOrder = new Order({
        TableID: orderData.TableID,
        Total: orderData.Total,
        OrderedItems: orderData.OrderedItems.map(item => ({
          menuId: item.menuId,
          Quantity: item.Quantity,
        })),
      });
      await createdOrder.save();

      orderEmitter.emit("newOrder", createdOrder);
      
      if (wss) {
        const newOrderPayload = {
          OrderID: createdOrder._id,
          TableID: createdOrder.TableID,
          Status: createdOrder.Status,
          Total: createdOrder.Total,
          OrderDateTime: createdOrder.OrderDateTime,
        };

        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(newOrderPayload));
          }
        });
      }
      return createdOrder;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  async getOrders(wss) {
    try {
      const orders = await Order.find().populate("OrderedItems");
      
      if (wss) {
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(orders));
          }
        });
      }
      return orders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  async updateOrderStatus(orderId, status, wss) {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(orderId, { Status: status }, { new: true }).populate("OrderedItems");
      
      if (wss) {
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(updatedOrder));
          }
        });
      }
      return updatedOrder;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  async deleteOrder(orderId) {
    try {
      const deletedOrder = await Order.findByIdAndDelete(orderId);
      return deletedOrder;
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  },

  onNewOrder(callback) {
    orderEmitter.on("newOrder", callback);
  },

  async getOrderByTableId(tableId) {
    try {
      const orders = await Order.find({ TableID: tableId, Status: { $ne: "CONFIRMED" } }).populate("OrderedItems");
      return orders;
    } catch (error) {
      console.error("Error fetching orders by Table ID:", error);
      throw error;
    }
  },

  async getAllOrderCalculation() {
    try {
      const ordersData = await Order.find({}, "_id Total OrderDateTime");
      return ordersData;
    } catch (error) {
      console.error("Error fetching order calculations:", error);
      throw error;
    }
  },

  async getOrdersByMonth(month, year) {
    try {
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0);
      
      const orders = await Order.find({
        OrderDateTime: {
          $gte: startOfMonth,
          $lt: endOfMonth,
        },
      });
      return orders;
    } catch (error) {
      console.error("Error fetching orders by month:", error);
      throw error;
    }
  },
};

module.exports = { orderService };
