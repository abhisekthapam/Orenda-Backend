const router = require("express").Router();
const menuController = require("../controllers/menu.controller");
const verify = require("../middleware/token.verify");

router.post("/additem", menuController.createMenu);
router.get("/allitems", menuController.getAllMenus);
router.get("/:id", menuController.getMenuById);
router.put("/:id", verify("admin"), menuController.updateMenu);
router.delete("/:id", verify("admin"), menuController.deleteMenu);

module.exports = router;
