const { orderService } = require("../service/order.service");
const { orderSchema } = require("../validator/order.schema.validator");
const mapRequestBodyToOrder = require("../utils/mapper");

const orderController = {
  async createOrder(req, res) {
    try {
      const { body } = req;
      // Validate request body using Zod schema
      const orderData = mapRequestBodyToOrder(body, orderSchema);
      const createdOrder = await orderService.createOrder(orderData);
      res.status(201).json(createdOrder);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  async getOrders(req, res) {
    try {
      const orders = await orderService.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async updateOrderStatus(req, res) {
    try {
      const { orderId } = req.params;
      const { Status } = req.body;
      if (Status == "CANCEL_CONFIRMED") {
        await orderService.deleteOrder(orderId);
        res.json({ msg: "order canceled" });
      } else {
        const updatedOrder = await orderService.updateOrderStatus(
          orderId,
          Status
        );
        res.json(updatedOrder);
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  async deleteOrder(req, res) {
    try {
      const { orderId } = req.params;
      const deletedOrder = await orderService.deleteOrder(orderId);
      res.json(deletedOrder);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  async getOrderByTableId(req, res) {
    try {
      const { tableId } = req.params;
      const order = await orderService.getOrderByTableId(tableId);
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAllOrder(req, res) {
    try {
      const orders = await orderService.getAllOrderCalculation();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async getOrdersByMonth(req, res) {
    const { month, year } = req.params; // Assuming month and year are passed as route parameters

    try {
      const orders = await orderService.getOrdersByMonth(month, year);

      res.json({ orders });
    } catch (error) {
      console.error("Error fetching orders by month:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = orderController;
