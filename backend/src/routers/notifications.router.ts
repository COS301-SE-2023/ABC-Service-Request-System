import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { NotificationsModel } from "../models/notifications.model";
import { sample_notifications } from "../sampleNotifications";

const router = Router();

router.get('/', expressAsyncHandler(
    async (req, res) => {
        const notifications = await NotificationsModel.find();
        res.send(notifications);
    }
));

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

router.get('/delete', expressAsyncHandler(
    async (req, res) => {
        await NotificationsModel.deleteMany({});
        res.send("Delete is done!");
    }
));

export default router;