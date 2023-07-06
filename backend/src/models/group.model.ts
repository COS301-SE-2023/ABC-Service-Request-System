import { Schema, connection } from "mongoose"
import { UserModel, user } from "./user.model"

export interface group {
    groupName: string
    backgroundPhoto: string
    people?: user[]

}

export const groupSchema = new Schema<group>(
    {
        groupName: {type: String, required: true},
        backgroundPhoto: {type: String, required: false},
        people: [{type: Schema.Types.ObjectId, ref: 'user'}],
    }
)

const groupDB = connection.useDb("GroupDB");
export const groupModel = groupDB.model("group", groupSchema);