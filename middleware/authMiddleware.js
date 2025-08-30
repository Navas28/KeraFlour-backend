import admin from "../config/firebase.js";
import User from "../model/User.js";

export const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expires token" });
    }
};
export const authorizeAdmin = async (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findOne({ uid: req.user.uid });
    if (!user || user.role !== "admin") return res.status(403).json({ message: "Admins only" });

    next();
};
