import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { TicketModel } from "../models/ticket.model";
import { sample_tickets } from "../data";

const router = Router();

router.post('/seed', expressAsyncHandler(
    async (req, res) => {
        const ticketsCount = await TicketModel.countDocuments();
        if(ticketsCount > 0){
            res.status(400).send("Seed is already done");
            return;
        }

        TicketModel.create(sample_tickets)
            .then(data => {res.status(201).send(data)})
            .catch(err => {res.status(500).send({message: err.message}); });
        // res.status(200).send("Seed is done!");
    }
));

router.get('/', expressAsyncHandler(
    async (req, res) => {
        const tickets = await TicketModel.find();
        res.status(200).send(tickets);
    }
));

export default router;