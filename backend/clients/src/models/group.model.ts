import { Schema, connection } from "mongoose"

export interface group {
    id: string
    groupName: string
    backgroundPhoto: string
    people?: string[]
    tickets?: string[]

}

export const groupSchema = new Schema<group>(
    {
        id: {type: String, required: true},
        groupName: {type: String, required: true},
        backgroundPhoto: {type: String, required: false},
        people: [{type: Schema.Types.ObjectId, ref: 'user'}],
        tickets: [{type: String, required: false}]
    }
)

const groupDB = connection.useDb("GroupDB");
export const groupModel = groupDB.model("group", groupSchema);