import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // Attach user info (userId and role) to request
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.user.role === requiredRole) {
      next(); // User has the required role
    } else {
      res.status(403).json({ error: "Access denied. Insufficient permissions." });
    }
  };

};

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).json({ error: "Access Denied: Missing Token" });
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach the decoded token payload (user info) to the request
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(500).json({ error: "Invalid or expired token" });
  }
};
