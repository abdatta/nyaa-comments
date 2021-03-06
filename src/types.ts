import { Document } from "mongoose";
import { PushSubscription } from "web-push";

export interface NyaaItem {
    comments: number;
    name: string;
    nyaaId: string;
    timestamp: number;
}

export interface NyaaComment {
    user: string;
    avatar: string;
    timestamp: number;
    comment: string;
    commentId: string;
    nyaaId: string;
    torrentName: string;
}

export interface NyaaCommentDocument extends NyaaComment, Document {}

export interface PushSubscriptionDocument extends PushSubscription, Document {}
