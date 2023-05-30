import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { loginModel } from "../models/login.model";
import { sample_login } from "../sampleLogin";

const router = Router();

router.get('/seed', expressAsyncHandler(
    async (req, res) => {
        const loginCount = await loginModel.countDocuments();
        if(loginCount > 0){
            res.send("Seed is already done");
            return;
        }

        await loginModel.create(sample_login);
        res.json("Seed is done!");
    }
));

router.get('/', expressAsyncHandler(
    async (req, res) => {
        const login = await loginModel.find();
        res.send(login);
    }
    
));

export default router;