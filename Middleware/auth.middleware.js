import jwt from "jsonwebtoken";

export const fetchUser = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;   // 🔥 IMPORTANT

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid token" });
  }
};