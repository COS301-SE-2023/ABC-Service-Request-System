import mongoose from "mongoose";
import { Schema } from "mongoose";
import { Iattachment } from "./attachment.model";
import attachmentModel from "./attachment.model";

export interface Icomment {
    author: string;
    authorPhoto: string;
    content: string;
    createdAt: Date;
    type: string;
    attachment?: Schema.Types.ObjectId,
}

const commentSchema = new Schema<Icomment>(
    {
      author: { type: String, required: true },
      authorPhoto: { type: String, required: true},
      content: { type: String, required: true },
      createdAt: { type: Date, required: true },
      type: { type: String, required: true },
      attachment: { type: Schema.Types.ObjectId, ref: 'attachment'},
    },
    {
      _id: false,
    }
);

export default mongoose.model('comment', commentSchema);