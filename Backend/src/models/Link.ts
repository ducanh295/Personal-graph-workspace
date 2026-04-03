import { Schema, model } from 'mongoose';

export const linkSchema = new Schema({
    sourceNoteId: { type: Schema.Types.ObjectId, ref: 'Note' },
    targetNoteId: { type: Schema.Types.ObjectId, ref: 'Note' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },

},
    { timestamps: true }
);

export default model('Link', linkSchema);