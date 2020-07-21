import { connect, Schema, model, Document } from 'mongoose';
import { NyaaComment } from '.';

export const connectStore = async () => {
    await connect('mongodb://localhost/my_database', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
};

export const NyaaCommentSchema = new Schema<NyaaComment>({
    user: { type: String },
    timestamp: { type: Number },
    comment: { type: String },
    commentId: { type: String, unique: true, required: true},
    nyaaId: {type: String, index: true, required: true}
});

export interface NyaaCommentDocument extends NyaaComment, Document {}

export const nyaaCommentModel = model<NyaaCommentDocument>('nyaa_comment', NyaaCommentSchema);
