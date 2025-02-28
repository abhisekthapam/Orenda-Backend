const app = require("./config/app.config");
require("dotenv").config();
const WebSocket = require("ws");
const EventEmitter = require("events");
const http = require("http");
const express = require("express");
const orderRoutes = require("./router/order.routes");
const { orderService } = require("./service/order.service");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

connectDB();


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

function sendToClient(client, data) {
  if (client.readyState === WebSocket.OPEN) {
    try {
      client.send(JSON.stringify(data));
    } catch (error) {
      console.error("Error sending data to client:", error);
    }
  }
}

async function sendOrderNotification(ws) {
  try {
    const orders = await orderService.getOrders();
    sendToClient(ws, orders);
    console.log("Orders notification sent to client:", orders);
  } catch (error) {
    console.error("Error sending order notification to client:", error);
    sendToClient(ws, { error: "Failed to fetch orders" });
  }
}

wss.on("connection", function connection(ws) {
  console.log("A new client connected");
  sendOrderNotification(ws);
  ws.on("message", async function incoming(message) {
    console.log("Received message from client:", message);
    if (message === "New Order Came") {
      console.log("New order notification received");
      sendOrderNotification(ws);
    }
  });

  ws.on("close", function close() {
    console.log("Client disconnected");
  });
});

orderService.onNewOrder(async (newOrder) => {
  wss.clients.forEach((client) => {
    sendToClient(client, newOrder);
  });
});

app.use("/api/v1/order", orderRoutes);

async function handleOrderStatusUpdate(ws, orderId, status) {
  try {
    const updatedOrder = await orderService.updateOrderStatus(
      orderId,
      status,
      wss
    );
    sendToClient(ws, updatedOrder);
    console.log("Order status updated and notification sent:", updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    sendToClient(ws, { error: "Failed to update order status" });
  }
}

wss.on("connection", function connection(ws) {
  console.log("A new client connected");

  sendOrderNotification(ws);

  ws.on("message", async function incoming(message) {
    console.log("Received message from client:", message);
    if (message === "New Order Came") {
      console.log("New order notification received");
      sendOrderNotification(ws);
    } else {
      try {
        const { orderId, status } = JSON.parse(message);
        await handleOrderStatusUpdate(ws, orderId, status);
      } catch (error) {
        console.error("Error parsing message:", error);
        sendToClient(ws, { error: "Invalid message format" });
      }
    }
  });

  ws.on("close", function close() {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
