import { Store } from "./store"
import { NyaaComment, NyaaCommentDocument } from "./types";
import { Schema } from "mongoose";

export class Repository {
    private nyaaCommentModel = this.store.connection.model<NyaaCommentDocument>('nyaa_comment', new Schema({
        user: { type: String },
        timestamp: { type: Number },
        comment: { type: String },
        commentId: { type: String, unique: true, required: true},
        nyaaId: {type: String, index: true, required: true}
    }));

    constructor(private store: Store) {
    }

    async countComments(nyaaId: string): Promise<number> {
        return this.nyaaCommentModel.countDocuments({ nyaaId }).exec();
    }

    async upsertComments(comment: NyaaComment): Promise<void> {
        await this.nyaaCommentModel.updateOne({ commentId: comment.commentId }, comment, { upsert: true }).exec();
    }

    async fetchComments(nyaaId?: string): Promise<NyaaCommentDocument[]> {
        return this.nyaaCommentModel.find(nyaaId ? { nyaaId } : {})
                                    .sort({ timestamp: -1 }).exec();
    }
}
