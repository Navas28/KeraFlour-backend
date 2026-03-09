import jwt from "jsonwebtoken";

export const authenticate = async (req, res, next) => {
  const cookieToken = req.cookies?.token;
  const headerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;

  const token = headerToken || cookieToken;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Reason:", error.message);

    if (cookieToken) {
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      console.log("Action: Cleared stale cookie from browser");
    }

    res.status(401).json({ message: "Invalid or expired token" });
  }
};
export const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admin only." });
  }
};
