import User from '../Models/user.schema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { sendPasswordResetEmail } from '../Utils/emailService.js';

dotenv.config();

const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || 'http://localhost:3000';
const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

export const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        console.log(hashPassword, "Hashed Password");
        
        const newUser = new User({ username, email, password: hashPassword, role });
        await newUser.save();

        res.status(200).json({message:"Registered Successfully", data:newUser })
    } catch (error) {
        console.log(error);
    }
}

export const loginUser = async (req,res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User Not Found!" });
        }
        const passwordMatch = await  bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(403).json({ message: "Invalid Credentials" });
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1hr' });
        user.token = token;
        res.status(200).json({ message: "Login Success", token: token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "login failed, Internal Server Error" });
    }
}

export const getUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        res.status(200).json({message:'Authorized User', data:[user]})
    } catch (error) {
        res.status(500).json({err:"Internal Server Error"})
    }
}

// Generate cryptographically secure random string for reset token
const generateResetToken = () => crypto.randomBytes(32).toString('hex');

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found with this email address' });
        }
        const resetToken = generateResetToken();
        user.passwordResetToken = resetToken;
        user.passwordResetExpires = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);
        await user.save();

        await sendPasswordResetEmail(user.email, resetToken, FRONTEND_BASE_URL);

        res.status(200).json({
            message: 'If an account exists with this email, a password reset link has been sent.',
        });
    } catch (error) {
        console.error('forgotPassword error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const verifyResetToken = async (req, res) => {
    try {
        const { token } = req.params;
        if (!token) {
            return res.status(400).json({ message: 'Reset token is required', valid: false });
        }
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: new Date() },
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset link', valid: false });
        }
        res.status(200).json({ message: 'Token is valid', valid: true });
    } catch (error) {
        console.error('verifyResetToken error:', error);
        res.status(500).json({ message: 'Internal server error', valid: false });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token and new password are required' });
        }
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: new Date() },
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset link' });
        }
        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('resetPassword error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};