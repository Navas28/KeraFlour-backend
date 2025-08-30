import express from "express";
import admin from "../config/firebase.js";
import User from "../model/User.js";

const router = express.Router()

router.post("/sync-user", async (req, res) => {
    const {token} = req.body;

    try {
        const decodedToken = await admin.auth().verifyIdToken(token)
        const {uid, email} = decodedToken;

        let user = await User.findOne({uid})
        if(!user){
            user = new User({uid, email, role: "user"})
            await user.save()
        }
        res.json({uid, email, role: user.role})
    } catch (error) {
        res.status(401).json({message: "Invalid token"})
    }
})
export default router;