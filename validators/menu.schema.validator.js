const { z } = require("zod");

// Define the menu schema using Zod
const menuSchema = z.object({
  name: z.string().min(2, "Menu name must be at least 2 characters long"),
  price: z.number().min(1, "Price must be a positive number"),
  isAvailable: z.boolean().default(false), // Fixed typo
  imagesId: z.string().min(24).max(24).optional(), // MongoDB ObjectId format
});

module.exports = { menuSchema };
