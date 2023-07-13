import { Schema, connection } from "mongoose"
import { ticket, ticketSchema } from "./ticket.model"

export interface project {
    id: string,
    name: string,
    logo: string,
    tickets: ticket []
}

export interface client {
    id: string,
    name: string,
    surname: string,
    organisation: string,
    email: string,
    industry: string,
    projects: project []
}

const projectSchema = new Schema<project>(
    {
        id: { type: String, required: true},
        name: { type: String, required: true},
        logo: { type: String, required: true},
        tickets: { type: [ticketSchema], required: true},

    },
    {
        _id : false
    }
)

const clientSchema = new Schema<client>(
    {
        id: { type: String, required: true},
        name: { type: String, required: true},
        surname: { type: String, required: true},
        organisation: { type: String, required: true},
        email: { type: String, required: true},
        industry: { type: String, required: true},
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

const clientDb = connection.useDb("ClientDB");
export const ClientModel = clientDb.model("client", clientSchema);