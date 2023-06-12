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

router.get('/delete', expressAsyncHandler(
    async (req, res) => {
        await TicketModel.deleteMany({});
        res.send("Delete is done!");
    }
));


// Edwin's add ticket function

// Add ticket
router.post('/addticket', expressAsyncHandler( async (req, res) => {
    try {
        console.log("New ticket request received: ", req.body);

        // for now, not checking on existing tickets

        const ticketCount = await TicketModel.countDocuments();

        const newTicket = new TicketModel({
            id: String(ticketCount + 1), // Assign the auto-incremented ID
            summary: req.body.summary,
            assignee: req.body.assignee,
            assigned: req.body.assigned,
            group: req.body.group,
            priority: req.body.priority,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            status: req.body.status
        });

        await newTicket.save();

        console.log("New ticket created succesfully");
        res.status(201).send({ message: "Ticket created succesfully" });
    }
    catch (error) {
        console.error("Ticket creation error:", error);
        res.status(500).send("An error occurred during ticket creation.");
    }
}));

export default router;
