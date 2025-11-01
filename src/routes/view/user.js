import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../../models/user.js";
import {
    authenticate,
    redirectIfAuthenticated
} from "../../middlewares/auth.js";

router.get("/login", redirectIfAuthenticated, (req, res) => {
    res.render("login", {
        title: "Login",
        showAlert: req.query.error === "failed",
    });
})

router.post("/login", redirectIfAuthenticated, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: "error", message: "faltan datos" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ status: "error", message: "email no registrado" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ status: "error", message: "credenciales invalidas" });
        }
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("currentUser", token, {
            signed: true,
            httpOnly: true,
            secure: true,
        })
        res.redirect("/user/current");
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
})

router.get("/current", authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            res.clearCookie("currentUser");
            return res.redirect("/user/login");
        }
        res.render("current", {
            title: "Perfil de Usuario",
            user: {
                name: user.name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.clearCookie("currentUser");
        res.redirect("/user/login");
    }
})

router.get("/logout", (req, res) => {
    res.clearCookie("currentUser");
    res.redirect("/user/login");
})

export default router;