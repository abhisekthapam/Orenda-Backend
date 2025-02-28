const verify = require("../middleware/token.verify");
const router = require("express").Router();
const orderController = require("../controllers/order.controller");
router.get("/all", verify("admin"), orderController.getOrders);
router.get("/calc", verify("admin"), orderController.getAllOrder);
router.get("/:year/:month", verify("admin"), orderController.getOrdersByMonth);
router.get("/:tableId", orderController.getOrderByTableId);
router.post("/", orderController.createOrder);
router.put("/:orderId", verify("admin"), orderController.updateOrderStatus);

module.exports = router;
