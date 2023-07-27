import { Schema, connection } from "mongoose"
import { ticket, ticketSchema } from "./testTicket.model"
import { group, groupSchema } from "./testGroup.model"

export interface project {
    id: string,
    _id?: string,
    name: string,
    logo: string,
    color: string,
    // tickets?: ticket [],
    assignedGroups?: group [],
}

export interface client {
    id: string,
    name: string,
    surname: string,
    organisation: string,
    email: string,
    emailVerified: boolean,
    password: string,
    industry: string,
    inviteToken?: string,
    projects: project []
}

export const projectSchema = new Schema<project>(
    {
        id: { type: String, required: true},
        name: { type: String, required: true},
        logo: { type: String, required: true},
        color: { type: String, required: true},
        // tickets: { type: [ticketSchema], required: false},
        assignedGroups: { type: [groupSchema], required: false},
    }
)

const clientSchema = new Schema<client>(
    {
        id: { type: String, required: true},
        name: { type: String, required: true},
        surname: { type: String, required: true},
        organisation: { type: String, required: true},
        email: { type: String, required: true},
        emailVerified: {type: Boolean, required: true, default: false},
        password: {type: String, required: true, select: true},
        industry: { type: String, required: true},
        inviteToken: { type: String }, // Add inviteToken field
        projects: { type: [projectSchema], required: true},
    },{
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        },
        timestamps: true
    }
)

const clientDb = connection.useDb("test");
export const TestClientModel = clientDb.model("clients", clientSchema);