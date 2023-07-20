import mongoose from "mongoose";
import { Schema } from "mongoose";

export interface Iattachment {
    name: string,
    url: string
}

const attachmentSchema = new Schema<Iattachment>(
    {
        name: {type: String},
        url: {type:String},
    }
)

export default mongoose.model('attachment', attachmentSchema);