import { Schema, connection } from "mongoose"

export interface group {
    id: string
    groupName: string
    backgroundPhoto: string
    people?: string[]

}

export const groupSchema = new Schema<group>(
    {
        id: {type: String, required: true},
        groupName: {type: String, required: true},
        backgroundPhoto: {type: String, required: false},
        people: [{type: Schema.Types.ObjectId, ref: 'user'}],
    }
)

const groupDB = connection.useDb("test");
export const testGroupModel = groupDB.model("group", groupSchema);