const router = require("express").Router();
const upload = require("../utils/file.upload");
const userRoutes = require("./user.routes");
const menuRoutes = require("./menu.routes");
const orderRoutes = require("./order.routes");
const imageController = require("../controllers/image.controller");

router.use("/user", userRoutes);
router.use("/menu", menuRoutes);
router.use("/order", orderRoutes);

router.post("/upload", upload.single("image"), imageController.createImage);
router.put(
  "/updateImage/:id",
  upload.single("image"),
  imageController.updateImage
);
module.exports = router;
