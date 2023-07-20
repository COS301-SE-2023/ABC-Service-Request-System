import expressAsyncHandler from "express-async-handler";
import TicketService from "../services/ticket.service";
import { Application } from "express";

const service = new TicketService();

const ticketApp = (app: Application) => {

    app.get('/', expressAsyncHandler(
        async (req, res) => {
            const tickets = await service.getAllTickets();
            res.json(tickets);
        }
    ));

}

export default ticketApp;