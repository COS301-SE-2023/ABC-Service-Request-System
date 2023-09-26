import { Schema, connection } from "mongoose"
import { ticket, ticketSchema } from "./ticket.model"
import { group, groupSchema } from "./group.model"

export interface project {
    id: string,
    _id?: string,
    name: string,
    logo: string,
    color: string,
    // tickets?: ticket [],
    assignedGroups?: group [],
    lowPriorityTime: string,
    mediumPriorityTime: string,
    highPriorityTime:string,
}

export interface request {
    id: string,
    type: string,
    status: string,
    additionalInformation?: string,
    projectName?: string,
    projectId?: string,
    clientId?: string,
    projectSelected?: string,
    summary?: string,
    description?: string,
    priority?: string,
    endDate?: string
}


export interface client {
    id: string,
    name: string,
    surname: string,
    organisation: string,
    profilePhoto: string,
    email: string,
    emailVerified: boolean,
    password: string,
    industry: string,
    inviteToken?: string,
    projects: project [],
    requests: request [],
    chatId?: string,
}

export const projectSchema = new Schema<project>(
    {
        id: { type: String, required: true},
        name: { type: String, required: true},
        logo: { type: String, required: true},
        color: { type: String, required: true},
        // tickets: { type: [ticketSchema], required: false},
        assignedGroups: { type: [groupSchema], required: false},
        lowPriorityTime: { type: String, required: false},
        mediumPriorityTime: { type: String, required: false},
        highPriorityTime:{ type: String, required: false},
    }
)

export const requestSchema = new Schema<request>(
    {
        id: { type: String, required: true},
        type: { type: String, required: true},
        status: { type: String, required: true},
        additionalInformation: { type: String, required: false},
        projectName: { type: String, required: false},
        projectId: { type: String, required: false},
        clientId: { type: String, required: false},
        projectSelected: { type: String, required: false},
        summary: { type: String, required: false},
        description: { type: String, required: false},
        priority: { type: String, required: false},
        endDate: { type: String, required: false}
    }
)

const clientSchema = new Schema<client>(
    {
        id: { type: String, required: true},
        name: { type: String, required: true},
        surname: { type: String, required: true},
        organisation: { type: String, required: true},
        profilePhoto: { type: String, required: true},
        email: { type: String, required: true},
        emailVerified: {type: Boolean, required: true, default: false},
        password: {type: String, required: true, select: true},
        industry: { type: String, required: true},
        inviteToken: { type: String }, // Add inviteToken field
        projects: { type: [projectSchema], required: true},
        requests: { type: [requestSchema], required: false},
        chatId: { type: String, required: false}
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

const clientDb = connection.useDb("ClientDB");
export const ClientModel = clientDb.model("client", clientSchema);