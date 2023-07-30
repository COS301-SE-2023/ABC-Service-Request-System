import { Schema, connection, model } from "mongoose"

export interface notifications {
    id: string;
    profilePhotoLink: string;
    notificationMessage: string;
    creatorEmail: string;
    assignedEmail: string;
    ticketSummary: string;
    ticketStatus: string;
    notificationTime: Date;
    link: string;
    readStatus: string;
}

export const notificationsSchema = new Schema<notifications> (
    {
        id: {type: String, required: true},
        profilePhotoLink: {type: String, required: true},
        notificationMessage: {type: String, required: true},
        creatorEmail: {type: String, required: true},
        assignedEmail: {type: String, required: true},
        ticketSummary: {type: String, required: true},
        ticketStatus: {type: String, required: true},
        notificationTime: {type: Date, required: true},
        link: {type: String},
        readStatus: {type: String, required: true}
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