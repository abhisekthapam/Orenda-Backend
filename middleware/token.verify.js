const jwt = require("jsonwebtoken");

// Middleware function for token authorization and role-based access control
function authorize(role) {
  return async (req, res, next) => {
    // Extract token from request headers or cookies
    const raw_token = req.headers.authorization;
    console.log(req.headers)
    if (!raw_token || !raw_token.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = raw_token.split("Bearer ")[1];

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Check if user has the required role
      if (role && decoded.role !== role) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      next();
    } catch (error) {
      console.error("Error verifying token:", error);
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
}
module.exports = authorize;
