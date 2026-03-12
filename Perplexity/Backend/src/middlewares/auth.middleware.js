import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

export async function authUser(req, res, next) {
    try {
        const token = req.cookies.token;        
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decodedToken.id);
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        if (!user.isVerified) {
            return res.status(403).json({ success: false, message: "Email not verified" });
        }
        req.user = { id: user._id, email: user.email, username: user.username };    
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}