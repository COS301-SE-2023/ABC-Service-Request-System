import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { TicketModel } from "../models/ticket.model";
import { sample_tickets } from "../utils/data";
import { comment } from "../models/ticket.model";
import multer from 'multer';
import { cloudinary } from "../configs/cloudinary";
import {jwtVerify} from "../middleware/jwtVerify";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

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
            .then((data: any) => {res.status(201).send(data)})
            .catch((err: { message: any; }) => {res.status(500).send({message: err.message}); });
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
        tickets.forEach((ticket: { project: string; }) => {
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

// Edwin's Router Functions
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

router.get('/getTicketUserEmail', jwtVerify(['Manager', 'Technical', 'Functinal', 'Admin']), expressAsyncHandler(async(req, res)=> {
  const userEmail = req.query.emailAddress;

  try {
    const tickets = await TicketModel.find({ assigned: userEmail });
    
    res.status(200).send(tickets);
  }
  catch(error) {
    res.status(500).send("Internal server error");
  }
}));

router.post('/sendEmailNotification', jwtVerify(['Manager', 'Technical', 'Functional', 'Admin']), expressAsyncHandler(async(req, res) => {
  const userEmails = req.body.emailAddresses;
  const ticketSummary = req.body.ticketSummary;
  const id = req.body.ticketId;
  const endDate = req.body.endDate;
  const priority = req.body.priority;
  const assigneePic = req.body.assigneePic;
  const assigneeEmail = req.body.assigneeEmail;
  const assignedPic = req.body.assignedPic;
  const assignedEmail = req.body.assignedEmail;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "hyperiontech.capstone@gmail.com",
      pass: "zycjmbveivhamcgt"
    }
  });

  const recipients = userEmails.join(', ');

  const mailOptions = {
    from: process.env.EMAIL,
    to: recipients,
    subject: "Ticket has been created",
    html: `
    <html>

<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }

        .email-container {
            max-width: 600px;
            margin: auto;
            background-color: rgba(33, 33, 33, 1);
            padding: 20px;
        }

        .header {
            background-color: #04538E;
            color: #fff;
            padding: 20px;
            text-align: center;
        }

        .header h1 {
            margin: 0;
        }

        .logo {
            display: block;
            margin: 0 auto 20px;
            width: 100px;
            height: auto;
        }

        .greeting {
            font-size: 24px;
            color: #fff;
            text-align: center;
        }

        .message {
            font-size: 18px;
            color: rgba(122, 122, 122, 1);
            text-align: center;
            margin: 20px 0;
        }

        .ticket-id {
            font-size: 18px;
            color: rgba(122, 122, 122, 1);
            text-align: center;
            margin: 20px 0;
        }

        .due-date {
            font-size: 18px;
            color: rgba(122, 122, 122, 1);
            text-align: center;
            margin: 20px 0;
        }

        .priority {
            font-size: 18px;
            color: rgba(122, 122, 122, 1);
            text-align: center;
            margin: 20px 0;
        }

        .assignee-content,
        .assigned-content {
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 8px;
            background: #fff;
            justify-content: center !important;
        }

        .assigneePic,
        .assignedPic {
            width: 40px;
            height: 40px;
            font-size: 18px;
            color: rgba(122, 122, 122, 1);
            align-self: center;
            justify-self: center;
            margin: 20px 0;
            border-radius: 50%;
        }

        .assigneeEmail,
        .assignedEmail {
            font-size: 18px;
            color: rgba(122, 122, 122, 1);
            text-align: center;
            margin-left: 1em;
            align-self: center !important;
            justify-content: center !important;
        }

        .assignee {
            font-size: 18px;
            color: rgba(122, 122, 122, 1);
            text-align: center;
            margin: 20px 0;
        }

        .assigned {
            font-size: 18px;
            color: rgba(122, 122, 122, 1);
            text-align: center;
            margin: 20px 0;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="header">
            <img src="cid:logo" alt="Luna Logo" class="logo">
            <h1>Ticket: ${ticketSummary} has been created</h1>
        </div>
        <p class="greeting">Notification for Ticket Creation</p>
        <p class="message">You will be able to communicate between the team members by replying to this email</p>

        <div class="content">
            <p class="greeting">Ticket Content</p>
            <div class="ticket-content">
                <p class="ticket-id">Ticket ID: ${id}</p>
                <p class="due-date">Due Date: ${endDate}</p>
                <p class="priority">Priority: ${priority}</p>
            </div>
            <p class="assignee">Assignee:</p>
            <div class="assignee-content" style="display: flex; align-items: center; justify-content: center;">
                <img src=${assigneePic} alt="assigneePic" class="assigneePic">
                <p class="assigneeEmail" style="display: flex; align-self: center; justify-self: center;">${assigneeEmail}</p>
            </div>
            <p class="assigned">Assigned: </p>
            <div class="assigned-content" style="display: flex; align-items: center; justify-content: center;">
                <img src=${assignedPic} alt="assignedPic" class="assignedPic">
                <p class="assignedEmail" style="display: flex; align-self: center; justify-self: center;">${assignedEmail}</p>
            </div>
        </div>
    </div>
</body>

</html>
    `,
    // attachments: [
    //     {
    //         filename: 'luna-logo.png',
    //         path: 'assets/luna-logo.png',
    //         cid: 'logo'
    //     }
    // ]
  };

    try {
      await transporter.sendMail(mailOptions); // Assuming you have a configured transporter
      res.status(200).send({message: "Emails sent!", recipients});
    } catch (error) {
      res.status(404).send({message: "Email not found!"});
    }

}));

export default router;
