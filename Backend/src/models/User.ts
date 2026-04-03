import { Schema, model } from 'mongoose';

export const userSchema = new Schema({
    displayName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    avatarUrl: { type: String },
    theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
},
    { timestamps: true }
);

export default model('User', userSchema);