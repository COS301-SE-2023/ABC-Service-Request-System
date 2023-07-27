import { notifications } from "../models/notifications.model"

const yesterdayDate = new Date();
const oneDayBefore = new Date(yesterdayDate);
oneDayBefore.setDate(yesterdayDate.getDate() - 1);

const lastweeksDate = new Date();
const oneWeekBefore = new Date(lastweeksDate);
oneWeekBefore.setDate(lastweeksDate.getDate() - 7);

const lastmonthsDate = new Date();
const oneMonthBefore = new Date(lastmonthsDate);
oneMonthBefore.setMonth(lastmonthsDate.getMonth() - 1);

export const sample_notifications: notifications[] = [
    {   
        id: "1",
        profilePhotoLink: "https://i.imgur.com/zYxDCQT.jpg",
        notificationMessage: " has closed an issue",
        creatorEmail: "jesse@example.com",
        assignedEmail: "jaimen@example.com",
        ticketSummary: "Update UI and bug fixes",
        ticketStatus: "Done",
        notificationTime: oneDayBefore,
        link: "1",
        readStatus: "Unread",
    },
    {
        id: "2",
        profilePhotoLink: "https://i.imgur.com/zYxDCQT.jpg",
        notificationMessage: " assigned an issue to you",
        creatorEmail: "john@example.com",
        assignedEmail: "ashir@example.com",
        ticketSummary: "testing tickets",
        ticketStatus: "Pending",
        notificationTime: oneWeekBefore,
        link: "2",
        readStatus: "Unread",
    },
    {
        id: "3",
        profilePhotoLink: "https://i.imgur.com/zYxDCQT.jpg",
        notificationMessage: " has closed an issue",
        creatorEmail: "mark@example.com",
        assignedEmail: "priyul@example.com",
        ticketSummary: "Epiuse frontend ticket",
        ticketStatus: "Done",
        notificationTime: oneMonthBefore,
        link: "3",
        readStatus: "Read",
    }
];