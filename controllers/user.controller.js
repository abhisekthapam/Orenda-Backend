const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userService = require("../service/user.service");
const mapRequestBodyToUser = require("../utils/mapper");
const { userSchema } = require("../validators/user.schema.validator");

// Function to generate JWT token
function generateToken(user) {
  return jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
}

async function createUser(req, res) {
  try {
    const userData = mapRequestBodyToUser(req.body, userSchema);

    // Check if user already exists
    const existingUser = await userService.getUserByEmail(userData.email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists. Please use a different email." });
    }

    // Hash password before saving using 12 rounds of salt
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    console.log("Hashed Password Before Saving:", hashedPassword);  // Log the password hash before saving

    // Create user with hashed password
    const newUser = await userService.createUser({
      ...userData,
      password: hashedPassword,
    });

    // Retrieve the saved user and check the password after saving
    const savedUser = await userService.getUserByEmail(userData.email);  // Retrieve the user again from the database
    console.log("Saved Hashed Password After Saving:", savedUser.password); // Log the saved hashed password

    // Ensure password is not included in the response
    const userWithoutPassword = savedUser.toObject ? savedUser.toObject() : { ...savedUser };
    delete userWithoutPassword.password;

    // Generate JWT token
    const token = generateToken(userWithoutPassword);

    return res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(400).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const userDetail = await userService.getUserByEmail(email);
    if (!userDetail) {
      return res.status(401).json({ error: "Authorization failed: User not found" });
    }

    // Debugging: Log entered and stored password hash
    console.log("Entered Password:", password);
    console.log("Stored Hashed Password:", userDetail.password);

    // Trim the entered password (just in case there are any spaces)
    const enteredPassword = password.trim();  // Remove any extra spaces from entered password
    const storedHashedPassword = userDetail.password.trim();  // Ensure there's no extra spaces

    // Log both values before comparison
    console.log("Trimmed Entered Password:", enteredPassword);
    console.log("Trimmed Stored Hash Password:", storedHashedPassword);

    // Compare entered password with stored hash using bcrypt.compare
    const isMatch = await bcrypt.compare(enteredPassword, storedHashedPassword);
    console.log("Password Match Result:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: "Authorization failed: Incorrect password" });
    }

    // Generate JWT token
    const userWithoutPassword = userDetail.toObject();
    delete userWithoutPassword.password;  // Remove the password from the response
    const token = generateToken(userWithoutPassword);

    res.status(200).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


async function getAllUsers(req, res) {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getUserById(req, res) {
  const userId = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function updateUser(req, res) {
  const userId = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }
    const userData = mapRequestBodyToUser(req.body, userSchema);
    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 12); // Salt rounds: 10
      userData.password = hashedPassword;
    } else {
      delete userData.password;
    }

    const updatedUser = await userService.updateUser(userId, userData);
    const userWithoutPassword = updatedUser.toObject();
    delete userWithoutPassword.password;
    const token = generateToken(userWithoutPassword);
    res.status(200).json({ ...userWithoutPassword, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function deleteUser(req, res) {
  const userId = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }
    await userService.deleteUser(userId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
};
