import mongoose from "mongoose";
import ticketModel from "../models/ticket.model"

class TicketRepository {
    async getAllTickets() {
      try {
        console.log('in ticket repo');
        const tickets = await ticketModel.find();
        console.log('tickets got: ');
        return tickets;
      } catch (error) {
        console.error(error);
        throw error; // Rethrow the error to the caller
      }
    }
  }

export default TicketRepository;