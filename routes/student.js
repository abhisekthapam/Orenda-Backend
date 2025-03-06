const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const upload = require("../middleware/uploads");

const {
  getusers,
  getStudent,
  register,
  login,
  searchBybatch,
  searchByCourse,
  updateStudent,
  deleteStudent,
  uploadImage,
  getMe,
} = require("../controllers/student");

router.post("/uploadImage", upload, uploadImage);
router.post("/register", register);
router.post("/login", login);
router.get("/getAllusers", protect, getusers);
router.get("/getusersBybatch/:batchId", protect, searchBybatch);
router.get("/getusersByCourse/:courseId", protect, searchByCourse);
router.put("/updateStudent/:id", protect, updateStudent);
router.delete("/deleteStudent/:id", protect, deleteStudent);
router.get("/getMe", protect, getMe);

module.exports = router;
