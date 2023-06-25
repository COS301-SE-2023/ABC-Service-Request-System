import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { TestNotificationsModel } from "../models/testNotifications.model";
import { sample_notifications } from "../sampleNotifications";

const router = Router();

router.post('/seed', expressAsyncHandler(
    async (req, res) => {
        const notificationsCount = await TestNotificationsModel.countDocuments();
        if(notificationsCount > 0){
            res.status(400).send("Seed is already done");
            return;
        }

        TestNotificationsModel.create(sample_notifications)
            .then(data => {res.status(201).send(data)})
            .catch(err => {res.status(500).send({message: err.message}); });
        // res.status(200).send("Seed is done!");
    }
));

router.get('/', expressAsyncHandler(
    async (req, res) => {
        const notifications = await TestNotificationsModel.find();
        res.send(notifications);
    }
));

router.get('/delete', expressAsyncHandler(
    async (req, res) => {
        await TestNotificationsModel.deleteMany({});
        res.send("Delete is done!");
    }
));

router.post('/newnotif', expressAsyncHandler(
    async (req, res) => {
        try {
            console.log("New notification request received: ", req.body);
    
            const newNotification = new TestNotificationsModel({
                notificationType: req.body.notificationType,
                creatorEmail: req.body.creatorEmail,
                assignedEmail: req.body.assignedEmail,
                ticketSummary: req.body.ticketSummary,
                link: req.body.link
            });
    
            await newNotification.save();
    
            console.log("New notification created succesfully");
            res.status(201).send({ message: "Notification created succesfully" });
        }
        catch (error) {
            console.error("Notification creation error:", error);
            res.status(500).send("An error occurred during notification creation.");
        }
    }
));

export default router;