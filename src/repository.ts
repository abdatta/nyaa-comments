import { Store } from "./store"
import { NyaaComment } from ".";
import { Schema, Document } from "mongoose";

export class NyaaCommentsRepository {
    private nyaaCommentModel = this.store.connection.model<NyaaCommentDocument>('nyaa_comment', new Schema({
        user: { type: String },
        timestamp: { type: Number },
        comment: { type: String },
        commentId: { type: String, unique: true, required: true},
        nyaaId: {type: String, index: true, required: true}
    }));

    constructor(private store: Store) {
    }

    async countComments (nyaaId: string): Promise<number> {
        return this.nyaaCommentModel.count({ nyaaId }).exec();
    }

    async upsertComment(comment: NyaaComment): Promise<void> {
        await this.nyaaCommentModel.updateOne({ commentId: comment.commentId }, comment, { upsert: true }).exec();
    }
}

interface NyaaCommentDocument extends NyaaComment, Document {}
