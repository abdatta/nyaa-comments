import { Store } from "./store"
import { NyaaComment, NyaaCommentDocument, PushSubscriptionDocument } from "./types";
import { Schema } from "mongoose";
import { PushSubscription } from "web-push";

export class Repository {
    private nyaaCommentModel = this.store.connection.model<NyaaCommentDocument>('nyaa_comment', new Schema({
        user: { type: String },
        avatar: { type: String },
        timestamp: { type: Number },
        comment: { type: String },
        commentId: { type: String, unique: true, required: true },
        nyaaId: { type: String, index: true, required: true },
        torrentName: { type: String }
    }));

    private pushSubscriptionModel = this.store.connection.model<PushSubscriptionDocument>('push_subscription', new Schema({
        endpoint: { type: String, required: true },
        keys: { type: {
            p256dh: { type: String },
            auth: { type: String }
        }}
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

    async saveSubscription(sub: PushSubscription): Promise<void> {
        await this.pushSubscriptionModel.create(sub);
    }

    async getSubscriptions(): Promise<PushSubscriptionDocument[]> {
        return this.pushSubscriptionModel.find().exec();
    }
}
