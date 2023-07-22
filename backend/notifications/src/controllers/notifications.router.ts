import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { NotificationsModel } from "../models/notifications.model";
import { sample_notifications } from "../utils/sampleNotifications";

const router = Router();

router.post('/seed', expressAsyncHandler(
    async (req, res) => {
        const notificationsCount = await NotificationsModel.countDocuments();
        if(notificationsCount > 0){
            res.status(400).send("Seed is already done");
            return;
        }

        NotificationsModel.create(sample_notifications)
            .then(data => {res.status(201).send(data)})
            .catch(err => {res.status(500).send({message: err.message}); });
        // res.status(200).send("Seed is done!");
    }
));

router.get('/', expressAsyncHandler(
    async (req, res) => {
        const notifications = await NotificationsModel.find();
        res.send(notifications);
    }
));

router.get('/delete', expressAsyncHandler(
    async (req, res) => {
        await NotificationsModel.deleteMany({});
        res.send("Delete is done!");
    }
));

router.get('/:id', expressAsyncHandler(
    async (req, res) => {
        const notification = await NotificationsModel.findOne({ id: req.query.id });
        if (notification) {
            res.send(notification);
        } else {
            res.status(404).send("Notification not found");
        }
    }
));

router.post('/newnotif', expressAsyncHandler(
    async (req, res) => {
        try {
            // console.log("New notification request received: ", req.body);

            const notificationsCount = await NotificationsModel.countDocuments();
    
            const newNotification = new NotificationsModel({
                id: String(notificationsCount + 1),
                profilePhotoLink: req.body.profilePhotoLink,
                notificationMessage: req.body.notificationMessage,
                creatorEmail: req.body.creatorEmail,
                assignedEmail: req.body.assignedEmail,
                ticketSummary: req.body.ticketSummary,
                ticketStatus: req.body.ticketStatus,
                notificationTime: req.body.notificationTime,
                link: req.body.link,
                readStatus: req.body.readStatus
            });
    
            await newNotification.save();
    
            // console.log("New notification created succesfully");
            res.status(201).send({ message: "Notification created succesfully" });
        }
        catch (error) {
            // console.error("Notification creation error:", error);
            res.status(500).send("An error occurred during notification creation.");
        }
    }
));

router.put('/changeToRead', expressAsyncHandler(
    async (req, res) => {
        const notificationsLink = req.body.id;
        const notificationsId = req.body.notificationsId;
    
        try {
            const notification = await NotificationsModel.findOneAndUpdate(
              { link: notificationsLink,
                id: notificationsId },
              { $set: { readStatus: 'Read' } },
              { new: true }
            );

            if (notification) {
                res.status(204).json({ message: 'Read Status changed successfully' });
            } else {
                res.status(404).json({ message: 'Notification not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
));

router.put('/changeToUnread', expressAsyncHandler(
    async (req, res) => {
        const notificationsId = req.body.id;
    
        try {
            const notification = await NotificationsModel.findOneAndUpdate(
              { link: notificationsId },
              { $set: { readStatus: 'Unread' } },
              { new: true }
            );

            if (notification) {
                res.status(204).json({ message: 'Read Status changed successfully' });
            } else {
                res.status(404).json({ message: 'Notification not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
));

export default router;