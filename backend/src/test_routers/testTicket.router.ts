import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { TestTicketModel } from "./testTicket.model";
import { sample_tickets } from "../../tickets/src/utils/data";
import mongoose from "mongoose";
import { comment } from "../../tickets/src/models/ticket.model";
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

router.get('/delete', expressAsyncHandler(
    async (req, res) => {
        await TestTicketModel.deleteMany({});
        res.send("Delete is done!");
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
        const ticket = await TestTicketModel.findOne({ id: req.query.id });
        if(ticket){
            res.status(200).send(ticket);
        }else{
            res.status(404).send({ message: 'Id not found' });
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

      const newComment: comment = {
        author: author,
        authorPhoto: 'https://res.cloudinary.com/ds2qotysb/image/upload/v1687775046/n2cjwxkijhdgdrgw7zkj.png',
        content: comment,
        createdAt: new Date(),
        type: type,
        attachment: attachment, 
      };
  
      try {
        const ticket = await TestTicketModel.findOneAndUpdate(
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
    
            const ticket = await TestTicketModel.findOneAndUpdate(
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
