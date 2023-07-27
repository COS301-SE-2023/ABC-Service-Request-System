import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { TicketModel } from "../models/ticket.model";
import { sample_tickets } from "../utils/data";
import mongoose from "mongoose";
import { comment } from "../models/ticket.model";
import multer from 'multer';
import { cloudinary } from "../configs/cloudinary";
import {jwtVerify} from "../../../jwtVerify/jwtVerify";

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

router.get('/', jwtVerify(['Manager', 'Technical', 'Functional', 'Admin']), expressAsyncHandler(
    async (req, res) => {
        const tickets = await TicketModel.find();
        res.status(200).send(tickets);
    }
));

router.get('/assigned', jwtVerify(['Manager', 'Technical', 'Functional', 'Admin']), expressAsyncHandler(
  async (req, res) => {
    const tickets = await TicketModel.find({ assigned: req.query.id });

    if(tickets){
        res.status(200).send(tickets);
    }else{
        res.status(404).send("No tickets found");
    }
  }
));

router.get('/projects', jwtVerify(['Manager', 'Technical', 'Functional', 'Admin']) , expressAsyncHandler(
  async (req, res) => {
    const groupName = req.query.groupName;
    const projects: string [] = [];
    try {
      const tickets = await TicketModel.find({ group: groupName});

      if(tickets){
        tickets.forEach((ticket) => {
          if(ticket.project && !projects.includes(ticket.project))
            projects.push(ticket.project);
        });

        res.status(200).send(projects);
      }
    } catch {
      res.status(500).send("Internal Server Error fetching projects");
    }
  }
));

router.get('/project', jwtVerify(['Manager', 'Technical', 'Functional', 'Admin']) , expressAsyncHandler(
  async (req, res) => {
    const projectName = req.query.name;
    try {
      const tickets = await TicketModel.find({ project: projectName});

      if(tickets){
        console.log('tickets found', tickets);
        res.status(200).send(tickets);
      } else {
        console.log('no tickets found');
        res.status(404).send("No tickets for this project");
      }
    } catch {
      res.status(500).send("Internal Server Error fetching projects");
    }
  }
));

router.get('/group', jwtVerify(['Manager', 'Technical', 'Functional', 'Admin']) , expressAsyncHandler(
  async (req, res) => {
    const groupName = req.query.name;

    try {
      const tickets = await TicketModel.find({ group: groupName });

      if(tickets) {
        res.status(200).send(tickets);
      } else {
        res.status(404).send("No tickets found for that group");
      }
    } catch {
      res.status(500).send("Internal error fetching tickets by group name");
    }
  }
))

router.get('/delete', expressAsyncHandler(
    async (req, res) => {
        await TicketModel.deleteMany({});
        res.status(200).send("Delete is done!");
    }
));


// Edwin's add ticket function

// Add ticket
router.post('/addticket', jwtVerify(['Admin', 'Manager']), expressAsyncHandler( async (req, res) => {
    try {
        // console.log("New ticket request received: ", req.body);
        // console.log(res.getHeader('Authorization') + "Headers");
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
            status: req.body.status,
            createdTime: new Date(),
            project: req.body.project,
            todo: req.body.todo,
            todoChecked: req.body.todoChecked
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

router.get('/id', jwtVerify(['Manager', 'Technical', 'Functional', 'Admin']), expressAsyncHandler(
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

router.put('/comment',jwtVerify(['Manager', 'Technical', 'Functional', 'Admin']), expressAsyncHandler(
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

  router.put('/updateStatus', jwtVerify(['Manager', 'Technical', 'Functional', 'Admin']), expressAsyncHandler(
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
          if (status === 'Done' && !ticket.timeToTicketResolution) {
            // Set timeToTicketResolution if the status is changed to 'Done' and it hasn't been set before
            ticket.timeToTicketResolution = new Date();
            await ticket.save();
          }
          res.status(200).json({ message: 'Ticket status updated successfully' });
        } else {
          res.status(404).json({ message: 'Ticket not found' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  ));

  router.post('/addTimeToFirstResponse', jwtVerify(['Manager', 'Technical', 'Functional', 'Admin']), expressAsyncHandler(async (req, res) => {  
    const ticketId = req.body.ticketId;
    const commentTime = new Date(req.body.commentTime); // Ensure commentTime is Date type
  
    try{
      const ticket = await TicketModel.findOne({ id: ticketId });
      if(ticket){
        // check if timeToFirstResponse is not set yet
        if(!ticket.timeToFirstResponse){
          // save the commentTime as the first response time
          ticket.timeToFirstResponse = commentTime;
          await ticket.save();
          res.status(200).send("Time to first response added");
        } else {
          res.status(200).send("First response time already recorded");
        }
      }
    }catch(error){
      res.status(500).send("Internal server error");
    }
  }));

// Edwin's Router Functions for Todo list

router.put('/updateTodoChecked/:id', jwtVerify(['Manager', 'Technical', 'Functional', 'Admin']) , expressAsyncHandler(async (req, res) => {
  const ticketId = req.params.id;
  const updatedTodoChecked = req.body.todoChecked;

  try {
    const ticket = await TicketModel.findOne({ id: ticketId });
    

    if (ticket) {
      ticket.todoChecked = updatedTodoChecked;

      await ticket.save();
      res.status(200).send({message: "Ticket todo checked updated"});
    }
    else {
      res.status(404).send("Ticket not found");
    }
  } catch(error) {
    console.log(ticketId, updatedTodoChecked, req, res);
    res.status(500).send("Internal server error");
  }
}));

  

export default router;
