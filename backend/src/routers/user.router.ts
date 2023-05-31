import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { UserModel } from "../models/user.model";
import { sample_users } from "../sampleUsers";  // Replace this with your actual sample user data

const router = Router();

router.get('/seed', expressAsyncHandler(
    async (req, res) => {
        const usersCount = await UserModel.countDocuments();
        if(usersCount > 0){
            res.send("Seed is already done");
            return;
        }

        await UserModel.create(sample_users);
        res.json("Seed is done!");
    }
));

router.get('/', expressAsyncHandler(
    async (req, res) => {
        const users = await UserModel.find();
        res.send(users);
    }
));

export default router;
