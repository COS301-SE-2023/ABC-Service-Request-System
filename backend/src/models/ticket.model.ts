import { Schema, model } from "mongoose"

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

export const TicketModel = model<any>('ticket', ticketSchema);