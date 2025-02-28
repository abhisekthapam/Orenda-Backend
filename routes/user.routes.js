const router = require("express").Router();

const userController = require("../controller/user.controller");
const verify = require("../middleware/token.verify");

router.get("/all", verify("admin"), userController.getAllUsers);
router.post("/adduser", userController.createUser);
router.put("/:id", verify("admin"), userController.updateUser);
router.get("/:id", verify("admin"), userController.getUserById);
router.delete("/:id", verify("admin"), userController.deleteUser);
router.post("/login", userController.login);

module.exports = router;
