import { notifications } from "./models/notifications.model"

export const sample_notifications: notifications[] = [
    {
        notificationType: "Message",
        creatorEmail: "jesse@example.com",
        assignedEmail: "jaimen@example.com",
        ticketSummary: "Update UI and bug fixes",
        link: "1"
    },
    {
        notificationType: "Completed",
        creatorEmail: "john@example.com",
        assignedEmail: "ashir@example.com",
        ticketSummary: "testing tickets",
        link: "2"
    },
    {
        notificationType: "Completed",
        creatorEmail: "mark@example.com",
        assignedEmail: "priyul@example.com",
        ticketSummary: "Epiuse frontend ticket",
        link: "3"
    }
];