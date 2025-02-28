const mongoose = require("mongoose");
const mapRequestBodyToMenu = require("../utils/mapper");
const { menuSchema } = require("../validator/menu.schema.validator");
const menuService = require("../service/menu.service");
const imageService = require("../service/image.service");
const deleteFile = require("../utils/file.delete");

// Create a new menu item
async function createMenu(req, res) {
  try {
    const menuData = await mapRequestBodyToMenu(req.body, menuSchema);
    const menuResponse = await menuService.createMenuItem(menuData);
    res.status(201).json({ menuResponse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get all menu items
async function getAllMenus(req, res) {
  try {
    const menus = await menuService.getAllMenuItems();
    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get menu item by ID
async function getMenuById(req, res) {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Menu ID" });
    }
    const menu = await menuService.getMenuItemById(id);
    if (!menu) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Update menu item by ID
async function updateMenu(req, res) {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Menu ID" });
    }
    const menuData = await mapRequestBodyToMenu(req.body, menuSchema);
    const updatedMenu = await menuService.updateMenuItem(id, menuData);
    res.json(updatedMenu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete menu item by ID
const deleteMenu = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Menu ID" });
    }
    const menu = await menuService.getMenuItemById(id);
    if (!menu) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    const { imagesId, images } = menu;
    await menuService.deleteMenuItem(id);
    if (images && images.name) deleteFile(images.name);
    if (imagesId) await imageService.deleteImage(imagesId);
    res.status(204).json({ msg: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createMenu,
  getAllMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
};
