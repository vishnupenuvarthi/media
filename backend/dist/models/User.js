import { Schema, model } from 'mongoose';
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['reader', 'reporter', 'editor', 'admin'], default: 'reader' },
    bio: String,
    avatar: String,
    social: {
        twitter: String,
        instagram: String
    }
}, { timestamps: true });
export const UserModel = model('User', UserSchema);
