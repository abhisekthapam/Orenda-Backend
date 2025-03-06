const express = require("express");
const multer = require("multer");
const path = require("path");
const { getProducts, addProduct } = require("../controllers/productController");

const router = express.Router();
const fs = require("fs");
const uploadDir = "./uploads/";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });
router.get("/", getProducts);
router.post("/", upload.single("image"), addProduct);

module.exports = router;
