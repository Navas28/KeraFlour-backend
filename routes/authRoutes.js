import express from "express";
import admin from "../config/firebase.js";
import User from "../model/User.js";

const router = express.Router();

router.post("/sync-user", async (req, res) => {
    const { token, name } = req.body;

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { uid, email } = decodedToken;

        let user = await User.findOne({ uid });
        if (!user) {
            user = new User({ uid, email, name, role: "user" });
        } else if (name && !user.name) {
            user.name = name;
        }
        await user.save();

        res.json({ uid, email, name: user.name, role: user.role });
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
});
export default router;
