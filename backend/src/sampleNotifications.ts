import { notifications } from "./models/notifications.model"

export const sample_notifications: notifications[] = [
    {
        notificationType: "Message",
        creatorEmail: "jesse@example.com",
        assignedEmail: "edwin@example.com",
        ticketSummary: "Work on Notifications",
        link: "1"
    },
    {
        notificationType: "Alert",
        creatorEmail: "jesse@example.com",
        assignedEmail: "ashir@example.com",
        ticketSummary: "CSS not using libraries :P",
        link: "2"
    },
    {
        notificationType: "Completed",
        creatorEmail: "jesse@example.com",
        assignedEmail: "priyul@example.com",
        ticketSummary: "Documentation",
        link: "3"
    }
]