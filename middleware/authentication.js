// Import user model later
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
  // Check request header for the jwt token
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    // throw new UnauthenticatedError("Invalid token");
    // res.status(500).json({ error: "No auth token" });
    next();
  }

  next();
};

module.exports = auth;
