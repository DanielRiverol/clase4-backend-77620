import express from "express";
import { Router } from "express";
//import userController from "../controllers/userController.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
const usersRouter = Router();

usersRouter.get("/", async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json({
            status: "success",
            data: users,
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
})


usersRouter.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ status: "error", message: "usuario no encontrado" });
        }
        res.json({
            status: "success",
            data: user,
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: + error.message });

    }
})

usersRouter.post("/register", async (req, res) => {
    try {
        const { name, last_name, email, password, role } = req.body;
        if (!name || !last_name || !email || !password) {
            return res.status(400).json({ status: "error", message: "faltan datos" });
        }
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ status: "error", message: "email ya registrado" });
        }
        const user = new User({
            name,
            last_name,
            email,
            password,
            role,
        });
        if (role) {
            user.role = role;
        }

        const userResponse = user.toObject();
        delete userResponse.password;

        await user.save();
        res.json({
            status: "success",
            data: user,
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
})


usersRouter.put("/:id", async (req, res) => {
    try {
        const { name, last_name, email, password, role } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ status: "error", message: "usuario no encontrado" });
        }
        if (name) {
            user.name = name;
        }
        if (last_name) {
            user.last_name = last_name;
        }
        if (email) {
            user.email = email;
        }
        if (password) {
            user.password = password;
        }
        if (role) {
            user.role = role;
        }
        const userResponse = user.toObject();
        delete userResponse.password;
        await user.save();
        res.json({
            status: "success",
            data: user,
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
})

usersRouter.delete("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ status: "error", message: "usuario no encontrado" });
        }
        await user.deleteOne();
        res.json({
            status: "success",
            data: user,
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
})

usersRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: "error", message: "faltan datos" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "error", message: "credenciales invalidas" });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ status: "error", message: "credenciales invalidas" });
        }

        // AQUI SE GENERA EL TOKEN
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // PASAMOS EL TOKEN POR COOKIE
        res.cookie("currentUser", token, {
            signed: true,
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 60,
            sameSite: "Strict",
        })
        res.json({
            status: "success",
            message: "login exitoso",
        })

    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });

    }
})

export default usersRouter;