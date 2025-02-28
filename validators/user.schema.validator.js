const { z } = require("zod");

// Define the Role enum
const Role = z.enum(["admin", "waitress", "kitchen_staff"]);

// Define the User schema using Zod
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  role: Role.default("waitress"), // Default role is waitress if not specified
});

module.exports = { userSchema };
