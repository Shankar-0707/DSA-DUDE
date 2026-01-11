import bcrypt from "bcrypt";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js"


export const signup = async (req, res, next) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing. Please ensure you are sending JSON data." });
        }
        const { name, username, email, password, confirmPassword } = req.body;

        // 1.) Basic Validation
        if (!name || !username || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are mandatory" });
        }

        if (password != confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // 2.) check if user exists (email or username)
        const userExists = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (userExists) {
            if (userExists.email === email) {
                return res.status(409).json({ message: "Email already exists" });
            }
            if (userExists.username === username) {
                return res.status(409).json({ message: "Username already exists" });
            }
        }

        // 3.) Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4.) Create User

        const user = await User.create({
            name,
            username,
            email,
            password: hashedPassword,
        });

        // 5.) Generate Token
        const token = generateToken(user._id);

        // 6.) Send Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            message: "Signup successful",
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing. Please ensure you are sending JSON data." });
        }
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        // 1.) Find User with Password
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // 2.) Compare password 
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Update login activity
        const alreadyLoggedToday = user.loginActivity.some(
            (date) => new Date(date).getTime() === today.getTime()
        );

        if (!alreadyLoggedToday) {
            user.loginActivity.push(today);
            await user.save();
        }

        // 3.) generate Token
        const token = generateToken(user._id);

        // 4.) Set Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        next(error);
    }
}

export const logout = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({ message: "Logout successful" });
}

export const getUser = async (req, res) => {
    res.status(200).json({
        success: true,
        user: {
            id: req.user._id,
            name: req.user.name,
            username: req.user.username,
            email: req.user.email,
        },
    });
}

