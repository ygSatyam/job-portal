
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: "User already exists with this email.",
                success: false
            });
        }

        const file = req.file;

        if (!file) {
            return res.status(400).json({
                message: "Profile photo is required.",
                success: false
            });
        }

        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: cloudResponse.secure_url
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false
            });
        }

        const isPasswordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false
            });
        }

        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.SECRET_KEY,
            { expiresIn: "1d" }
        );

        const safeUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200)
            .cookie("token", token, {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: "none"
            })
            .json({
                message: `Welcome back ${safeUser.fullname}`,
                user: safeUser,
                success: true
            });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200)
            .clearCookie("token", {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            })
            .json({
                message: "Logged out successfully.",
                success: true
            });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;

        const userId = req.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio !== undefined) user.profile.bio = bio;

        if (skills !== undefined) {
            user.profile.skills = Array.isArray(skills)
                ? skills
                : skills.split(",").map(skill => skill.trim());
        }

        const file = req.file;

        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(
                fileUri.content
            );

            user.profile.resume = cloudResponse.secure_url;
            user.profile.resumeOriginalName = file.originalname;
        }

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                profile: user.profile
            },
            success: true
        });
    } catch (error) {
        console.error("Update profile error:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};
