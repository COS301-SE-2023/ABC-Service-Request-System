import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { TestTicketModel } from "../models/testTicket.model";
import { sample_tickets } from "../data";
import mongoose from "mongoose";

const router = Router();

router.post('/seed', expressAsyncHandler(
    async (req, res) => {
        const ticketsCount = await TestTicketModel.countDocuments();
        if(ticketsCount > 0){
            res.status(400).send("Seed is already done");
            return;
        }

        TestTicketModel.create(sample_tickets)
            .then(data => {res.status(201).send(data)})
            .catch(err => {res.status(500).send({message: err.message}); });
        // res.status(200).send("Seed is done!");
    }
));

router.get('/', expressAsyncHandler(
    async (req, res) => {
        const tickets = await TestTicketModel.find();
        res.status(200).send(tickets);
    }
));

router.get('/id', expressAsyncHandler(
    async (req, res) => {
        const id = String(req.query.id);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).send('Invalid ObjectId');
            return;
          }

        const objectId = new mongoose.Types.ObjectId(id);
        const ticket = await TestTicketModel.findOne({ _id: objectId });
        if(ticket){
            res.status(200).send(ticket);
        }else{
            res.status(404).send("Id not found");
        }
    }
));

router.put('/comment', expressAsyncHandler(
    async (req, res) => {
        const ticketId = req.body.ticketId;
        const comment = req.body.comment;

        try{
            const ticket = await TestTicketModel.findByIdAndUpdate(ticketId, { $push: { comments: comment } }, { new: true });

            if (ticket) {
                res.status(200).json({ message: 'Comment added successfully' });
            } else {
                res.status(404).json({ message: 'Ticket not found' });
            }

        }catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
));

export default router;
