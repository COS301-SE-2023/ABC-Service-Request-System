import { Schema, connection, model } from "mongoose"

export interface notifications {
    notificationType: string;
    creatorEmail: string;
    assignedEmail: string;
    ticketSummary: string;
    link: string;
}

export const notificationsSchema = new Schema<notifications> (
    {
        notificationType: {type: String, required: true},
        creatorEmail: {type: String, required: true},
        assignedEmail: {type: String, required: true},
        ticketSummary: {type: String, required: true},
        link: {type: String, required: true}
    },
    {
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        },
        timestamps: true
    }
);

const notificationsDB = connection.useDb("NotificationsDB");
export const NotificationsModel = notificationsDB.model("notifications", notificationsSchema)