import mongoose from 'mongoose';




const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: String,
    token: String,
    passwordResetToken: { type: String, default: null },
    passwordResetExpires: { type: Date, default: null },
});

const User = mongoose.model("User",userSchema);
export default User;