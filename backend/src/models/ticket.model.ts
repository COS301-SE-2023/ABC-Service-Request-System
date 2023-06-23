import { Schema, connection, model } from "mongoose"
import { dbConnection } from '../configs/ticketDB.config';

// const ticketDb = dbConnection(); <- this breaks it
export interface ticket{
    id: string,
    summary: string,
    assignee: string,
    assigned: string,
    // group: {
    //     name: string,
    //     code: string,
    //     region: string,
    //     country: string
    // },
    group: string,
    priority: "High" | "Medium" | "Low",
    startDate: string,
    endDate: string,
    status: "Done" | "Pending" | "Active"
}

export const ticketSchema = new Schema<any>(
    {
        id: {type: String, required: true},
        summary: {type: String, required: true},
        assignee: {type: String, required: true},
        assigned: {type: String, required: true},
        group: {type: String, required: true},
        priority: {type: String, required: true},
        startDate: {type: String, required: true},
        endDate: {type: String, required: true},
        status: {type: String, required: true},
    },{
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        },
        timestamps: true
    }
);

const ticketDb = connection.useDb("TicketDB");
export const TicketModel = ticketDb.model("ticket", ticketSchema);