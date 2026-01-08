import { Schema, model } from 'mongoose';
const UserSchema = new Schema({
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['reader', 'reporter', 'editor', 'admin'], default: 'reader', index: true },
    profile: {
        name: { type: String, required: true },
        bio: String,
        avatar: String
    },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' }
}, { timestamps: true });
export const UserModel = model('User', UserSchema);
