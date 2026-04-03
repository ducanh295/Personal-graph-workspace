import { Schema, model } from 'mongoose';

export const noteSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true, },
    tags: { type: [String] },
    wordCount: { type: Number, default: 0 },
},
    { timestamps: true }
);
noteSchema.index({ userId: 1, updatedAt: -1 });
noteSchema.index({
    title: "text",
    content: "text"
});
export default model('Note', noteSchema);