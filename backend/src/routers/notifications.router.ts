import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { NotificationsModel } from "../models/notifications.model";

const router = Router();

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

export default router;