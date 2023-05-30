import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { TicketModel } from "../models/ticket.model";
import { sample_tickets } from "../data";

const router = Router();

router.get('/seed', expressAsyncHandler(
    async (req, res) => {
        const ticketsCount = await TicketModel.countDocuments();
        if(ticketsCount > 0){
            res.send("Seed is already done");
            return;
        }

        await TicketModel.create(sample_tickets);
        res.json("Seed is done!");
    }
));

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the ticket router!' });
});

export default router;