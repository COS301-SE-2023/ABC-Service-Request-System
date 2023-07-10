import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { TicketModel } from "../models/ticket.model";
import { sample_tickets } from "../data";
import mongoose from "mongoose";
import { comment } from "../models/ticket.model";
import multer from 'multer';
import { cloudinary } from '../configs/cloudinary';
import { UserModel } from "../models/user.model";


const axios = require('axios');

const router = Router();

const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }
      //check if pdf
      const result = await cloudinary.uploader.upload(req.file.path);
      res.status(200).json({ url: result.secure_url });
    } catch (error) {
      res.status(500).json({ message: 'File upload error' });
    }
});
  

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
        res.status(200).send("Delete is done!");
    }
));


// Edwin's add ticket function

// Add ticket
router.post('/addticket', expressAsyncHandler( async (req, res) => {
    try {
        // console.log("New ticket request received: ", req.body);

        // for now, not checking on existing tickets

        const ticketCount = await TicketModel.countDocuments();

        const newTicket = new TicketModel({
            id: String(ticketCount + 1), // Assign the auto-incremented ID
            description: req.body.description,
            summary: req.body.summary,
            assignee: req.body.assignee,
            assigned: req.body.assigned,
            group: req.body.group,
            priority: req.body.priority,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            status: req.body.status
        });

        console.log("new ticket: ", newTicket);

        await newTicket.save();

        // console.log("New ticket created succesfully");
        res.status(201).send({ message: "Ticket created succesfully" , newTicketID : newTicket.id});
    }
    catch (error) {
        // console.error("Ticket creation error:", error);
        res.status(500).send("An error occurred during ticket creation.");
    }
}));

router.get('/id', expressAsyncHandler(
    async (req, res) => {
        // const id = String(req.query.id);

        // if (!mongoose.Types.ObjectId.isValid(id)) {
        //     res.status(400).send('Invalid ObjectId');
        //     return;
        //   }

        // const objectId = new mongoose.Types.ObjectId(id);
        const ticket = await TicketModel.findOne({ id: req.query.id });
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
    const author = req.body.author;
    const type = req.body.type;
    const attachment = req.body.attachment; 
    const authorPhoto = req.body.authorPhoto;
    const newComment: comment = {
      author: author,
      content: comment,
      createdAt: new Date(),
      type: type,
      attachment: attachment,
      authorPhoto: authorPhoto
    };

    try {
      const ticket = await TicketModel.findOneAndUpdate(
        { id: ticketId },
        { $push: { comments: newComment } },
        { new: true }
      );

      if (ticket) {
        res.status(200).json({ message: 'Comment added successfully' });
      } else {
        res.status(404).json({ message: 'Ticket not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
));

  router.put('/updateStatus', expressAsyncHandler(
    async (req, res) => {
      try {
        const ticketId = req.body.ticketId;
        const status = req.body.status;
        // console.log('status is ' +  status);
        // console.log('ticket id is ' + ticketId);
  
        const ticket = await TicketModel.findOneAndUpdate(
          { id: ticketId },
          { status: status },
          { new: true }
        );
  
        if (ticket) {
          res.status(200).json({ message: 'Ticket status updated successfully' });
        } else {
          res.status(404).json({ message: 'Ticket not found' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  ));
  
  router.get('/overdueTickets/:userId', expressAsyncHandler(
    async (req, res) => {
        // getting the current date
        const currentDate = new Date();

        // finding all tickets assigned to the user
        const assignedTickets = await TicketModel.find({
            assigned: req.params.userId,
            status: {$ne: "Done"}
        });

        // filter the tickets to find which are overdue
        const overdueTickets = assignedTickets.filter(ticket => {
            const [day, month, year] = ticket.endDate.split("/");
            const ticketEndDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            return ticketEndDate < currentDate;
        });

        // sending the response
        if (overdueTickets.length) {
            res.status(200).send(overdueTickets);
        } else {
            res.status(404).send("No overdue tickets found for the user");
        }
    }
));

router.get('/dueToday/:userId', expressAsyncHandler(
  async (req, res) => {
      // getting the current date
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // set to start of the day

      // finding all tickets assigned to the user
      const assignedTickets = await TicketModel.find({
          assigned: req.params.userId,
          status: {$ne: "Done"}
      });

      // filter the tickets to find which are due today
      const dueTodayTickets = assignedTickets.filter(ticket => {
          const [day, month, year] = ticket.endDate.split("/");
          const ticketEndDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          ticketEndDate.setHours(0, 0, 0, 0); // set to start of the day
          return ticketEndDate.getTime() === currentDate.getTime();
      });

      // sending the response
      if (dueTodayTickets.length) {
          res.status(200).send(dueTodayTickets);
      } else {
          res.status(404).send("No tickets due today found for the user");
      }
  }
));

router.get('/pendingTickets/:userId', async (req, res, next) => {
  try {
      // Fetching user's name from the User Service
      const userResponse = await axios.get(`http://localhost:3000/api/user/${req.params.userId}`);
      console.log("userResponse: ", userResponse);
      
      const user = userResponse.data;
      if (!user) {
          return res.status(404).send("User not found");
      }

      // Finding all tickets assigned to the user that are not done
      const pendingTickets = await TicketModel.find({
          assigned: user.name,
          status: { $in: ["Pending"] }
      });

      // Sending the response
      if (pendingTickets.length) {
          res.status(200).send({ totalPendingTickets: pendingTickets.length });
      } else {
          res.status(404).send("No pending tickets found for the user");
      }
  } catch (err) {
      next(err);
  }
});

router.get('/activeTickets/:userId', async (req, res, next) => {
  try {
      // Fetching user's name from the User Service
      const userResponse = await axios.get(`http://localhost:3000/api/user/${req.params.userId}`);
      console.log("userResponse: ", userResponse);
      
      const user = userResponse.data;
      if (!user) {
          return res.status(404).send("User not found");
      }

      // Finding all tickets assigned to the user that are not done
      const pendingTickets = await TicketModel.find({
          assigned: user.name,
          status: { $in: ["Active"] }
      });

      // Sending the response
      if (pendingTickets.length) {
          res.status(200).send({ totalPendingTickets: pendingTickets.length });
      } else {
          res.status(404).send("No pending tickets found for the user");
      }
  } catch (err) {
      next(err);
  }
});


  

export default router;
