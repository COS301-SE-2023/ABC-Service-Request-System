import { Schema, connection } from "mongoose"
import { UserModel, user } from "./user.model"

export interface group {
    id: string
    groupName: string
    backgroundPhoto: string
    people?: user[]

}

export const groupSchema = new Schema<group>(
    {
        id: {type: String, required: true},
        groupName: {type: String, required: true},
        backgroundPhoto: {type: String, required: false},
        people: [{type: Schema.Types.ObjectId, ref: 'user'}],
    }
)

const groupDB = connection.useDb("GroupDB");
export const groupModel = groupDB.model("group", groupSchema);