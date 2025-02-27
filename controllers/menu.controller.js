const mapRequestBodyToMenu = require("../utils/mapper");
const menuSchema = require("../validator/menu.schema.validator");
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
  const menuData = await mapRequestBodyToMenu(req.body, menuSchema);

  try {
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
    const {
      imagesId,
      images: { name },
    } = await menuService.getMenuItemById(id);
    await menuService.deleteMenuItem(id);
    deleteFile(name);
    await imageService.deleteImage(imagesId);
    res.status(204).json({ msg: data });
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
