const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check Authorization header
    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header missing",
        error: "Unauthorized"
      });
    }

    // Check Bearer format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization format must be Bearer <token>",
        error: "Unauthorized"
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token missing",
        error: "Unauthorized"
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretjwtsecretkey_practical7_2026"
    );

    // Store decoded user information
    req.user = decoded;

    // Continue to next middleware/controller
    next();

  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
      error: "Unauthorized"
    });
  }
};

module.exports = authMiddleware;
