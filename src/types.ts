import { Document } from "mongoose";

export interface NyaaItem {
    comments: number;
    name: string;
    nyaaId: string;
    timestamp: number;
}

export interface NyaaComment {
    user: string;
    timestamp: number;
    comment: string;
    commentId: string;
    nyaaId: string;
}

export interface NyaaCommentDocument extends NyaaComment, Document {}
