import { Schema, connection } from "mongoose"

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
    status: "Done" | "Pending" | "Active",
    comments: string [],
}

export const ticketSchema = new Schema<any>(
    {
        summary: {type: String, required: true},
        assignee: {type: String, required: true},
        assigned: {type: String, required: true},
        group: {type: String, required: true},
        priority: {type: String, required: true},
        startDate: {type: String, required: true},
        endDate: {type: String, required: true},
        status: {type: String, required: true},
        comments: {type: [String]}
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

const ticketDb = connection.useDb("test");
export const TestTicketModel = ticketDb.model("ticket", ticketSchema);