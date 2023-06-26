import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { TicketModel } from "../models/ticket.model";
import { sample_tickets } from "../data";
import mongoose from "mongoose";
import { comment } from "../models/ticket.model";
import multer from 'multer';
import { cloudinary } from '../configs/cloudinary';


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
        res.status(201).send({ message: "Ticket created succesfully" , newTicketID : newTicket.id});
    }
    catch (error) {
        console.error("Ticket creation error:", error);
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
      const attachmentUrl = req.body.attachmentUrl; 
      const newComment: comment = {
        author: author,
        content: comment,
        createdAt: new Date(),
        type: type,
        attachmentUrl: attachmentUrl, 
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
  
  

export default router;
