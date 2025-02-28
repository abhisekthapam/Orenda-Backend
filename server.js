const express = require('express');
const app1 = require("./config/app.config");
const WebSocket = require("ws");
const EventEmitter = require("events");
const http = require("http");
const orderRoutes = require("./routes/order.routes");
const { orderService } = require("./service/order.service");
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const path = require('path');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

connectDB();

const server = http.createServer(app1);
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

app1.use("/api/v1/order", orderRoutes);

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


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/v1/auth', authRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
