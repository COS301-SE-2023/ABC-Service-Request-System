import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { TicketModel } from "../models/ticket.model";
import { sample_tickets } from "../utils/data";
import { comment } from "../models/ticket.model";
import { history } from "../models/ticket.model";
import multer from 'multer';
import { cloudinary } from "../configs/cloudinary";
import {jwtVerify} from "../middleware/jwtVerify";
import axios from "axios";
import OpenAI from "openai";
import Configuration from "openai";

import dotenv from "dotenv";
dotenv.config();

const router = Router();

const storage = multer.diskStorage({});
const upload = multer({ storage });


router.post('/generateTodoFromDescription', async(req,res) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const {description} = req.body;
  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo", 
        messages: [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": `Based on the description "${description}", generate three todos. The todos must be a maximum of 50 words each.:`}
        ]
  });
  
  if (chatCompletion.choices) {
    const todos = chatCompletion.choices[0].message.content!.split("\n").filter((todo:string) => todo.trim() !== '').map((todo:string) => todo.trim());
      res.status(200).json(todos);
        // console.log(todos);
    } else {
        res.status(500).json({ message: 'Failed to generate todos from OpenAI.' });
    }

})

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

// router.get('/', jwtVerify(['Manager', 'Technical', 'Functional', 'Admin']), expressAsyncHandler(
//   async (req, res) => {
//       const tickets = await TicketModel.find();
//       res.status(200).send(tickets);
//   }
// ));

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

router.get('/project', expressAsyncHandler(
  async (req, res) => {
    const projectName = req.query.name;
    try {
      const tickets = await TicketModel.find({ project: projectName});

      if(tickets){
        // console.log('tickets found', tickets);
        res.status(200).send(tickets);
      } else {
        // console.log('no tickets found');
        res.status(404).send("No tickets for this project");
      }
    } catch (error) {
      console.log(error);
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

        // console.log("new ticket: ", newTicket);

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
    // console.log(ticketId, updatedTodoChecked, req, res);
    res.status(500).send("Internal server error");
  }
}));

router.post('/:id/worklogs', expressAsyncHandler(async (req, res) => {
  const ticketId = req.params.id;

  try {
      const ticket = await TicketModel.findOne({ id: ticketId });

      if (ticket) {
          // Check if workLogs exists, if not initialize it as an empty array
          if (!ticket.workLogs) {
              ticket.workLogs = [];
          }

          const newWorkLog = req.body;
          ticket.workLogs.push(newWorkLog);
          await ticket.updateOne({ workLogs: ticket.workLogs });
          res.status(201).send(ticket);
      } else {
          res.status(404).send("Ticket not found");
      }
  } catch (error) {
      console.error("Error adding worklog:", error);
      res.status(500).send("Internal server error");
  }
}));


router.get('/latestworklogs/:author', async (req, res) => {
  const author = req.params.author;

  try {
    // Find tickets with workLogs by the author
    const tickets = await TicketModel.find({ "workLogs.author": author })
      .populate({
        path: "workLogs",
        match: { author: author },
      })
      .select("summary workLogs")
      .exec();

    let results: any[] = [];

    tickets.forEach(ticket => {
      if (ticket.workLogs) {
        ticket.workLogs.forEach(worklog => {
          if (worklog.author === author) {
            results.push({
              ticketSummary: ticket.summary,
              worklog: worklog
            });
          }
        });
      }
    });

    // Sort the results by date and then time
    results.sort((a, b) => {
      const dateA = new Date(a.worklog.dateStarted);
      const dateB = new Date(b.worklog.dateStarted);

      // If dates are the same, compare timeStarted
      if (dateA.getTime() === dateB.getTime()) {
        const timeA = a.worklog.timeStarted.split(':').map(Number);
        const timeB = b.worklog.timeStarted.split(':').map(Number);
        return (timeB[0] * 60 + timeB[1]) - (timeA[0] * 60 + timeA[1]);
      }

      return dateB.getTime() - dateA.getTime(); // latest first
    });

    // Take the top 5
    results = results.slice(0, 5);

    res.json(results);
  } catch (error) {
    res.status(500).send({ message: 'Server error', error });
  }
});


router.get('/latestworklogsbygroup/:author/:group', async (req, res) => {
  const author = req.params.author;
  const group = req.params.group;

  try {
    // Find tickets with workLogs by the author and belonging to the given group
    const tickets = await TicketModel.find({
        group: group, 
        "workLogs.author": author
      })
      .populate({
        path: "workLogs",
        match: { author: author }
      })
      .select("summary workLogs")
      .exec();

    let results: any[] = [];

    tickets.forEach(ticket => {
      if (ticket.workLogs) {
        ticket.workLogs.forEach(worklog => {
          if (worklog.author === author) {
            results.push({
              ticketSummary: ticket.summary,
              worklog: worklog
            });
          }
        });
      }
    });

    // Sort the results by date and then time
    results.sort((a, b) => {
      const dateA = new Date(a.worklog.dateStarted);
      const dateB = new Date(b.worklog.dateStarted);

      if (dateA.getTime() === dateB.getTime()) {
        const timeA = a.worklog.timeStarted.split(':').map(Number);
        const timeB = b.worklog.timeStarted.split(':').map(Number);
        return (timeB[0] * 60 + timeB[1]) - (timeA[0] * 60 + timeA[1]); // latest first
      }

      return dateB.getTime() - dateA.getTime(); // latest first
    });

    // Take the top 5
    results = results.slice(0, 5);

    res.json(results);
  } catch (error) {
    console.error("Server error:", error); // Log the error for debugging
    res.status(500).send({ message: 'Server error', error });
  }
});



router.get('/test', (req, res) => {
  res.send('Test route works!');
});


router.post('/generateTodoFromDescription', async (req, res) => {
  const { description } = req.body;

  const OPENAI_API_KEY = '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';
  const OPENAI_ENDPOINT = 'https://api.openai.com/v2/chat/completions'; 
  const headers = {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
  };
  const payload = {
      model: "gpt-3.5-turbo",
      messages: [
          {"role": "system", "content": "You are a helpful assistant."},
          {"role": "user", "content": `Based on the description "${description}", generate three todos:`}
      ]
  };

  try {
      const response = await axios.post(OPENAI_ENDPOINT, payload, { headers });
      if (response.data && response.data.choices && response.data.choices[0] && response.data.choices[0].message) {
          const todos = response.data.choices[0].message.content.split("\n").filter((todo:string) => todo.trim() !== '').map((todo:string) => todo.trim());
          res.status(200).json({ todos });
      } else {
          res.status(500).json({ message: 'Failed to generate todos from OpenAI.' });
      }
  } catch (error) {
      console.error('Error details:', error);
      res.status(500).json({ message: 'Error calling OpenAI API.' });
  }
});

router.put('/:id/updateAssigned', jwtVerify(['Manager', 'Technical', 'Functional', 'Admin']) , expressAsyncHandler(async (req, res) => {
  const ticketId = req.params.id;
  const newAssignedEmail = req.body.newAssignedEmail;
  console.log('in ticket.router');
  console.log(ticketId);
  console.log(newAssignedEmail);

  try {
    const ticket = await TicketModel.findOne({ id: ticketId });
    
    if (ticket) {
      console.log(ticket);
      ticket.assigned = newAssignedEmail;

      await ticket.save();
      res.status(200).send({message: "Ticket assigned member updated"});
    }
    else {
      res.status(404).send("Ticket not found");
    }
  } catch(error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
}));

router.post('/:id/addHistory',jwtVerify(['Manager', 'Technical', 'Functional', 'Admin']), expressAsyncHandler(async(req,res) => {
  const ticketId = req.params.id;

  const personWhoChangedAssigned = req.body.personWhoChangedAssigned;
  const personWhoChangedPhoto = req.body.personWhoChangedPhoto;
  const prevAssignedName = req.body.prevAssignedName;
  const prevAssignedPhoto = req.body.prevAssignedPhoto;
  const newAssignedName = req.body.newAssignedName;
  const newAssignedPhoto = req.body.newAssignedPhoto;

  const newHistory: history = {
    personWhoChangedAssigned: personWhoChangedAssigned,
    personWhoChangedPhoto: personWhoChangedPhoto,
    prevAssignedName: prevAssignedName,
    prevAssignedPhoto: prevAssignedPhoto,
    newAssignedName: newAssignedName,
    newAssignedPhoto: newAssignedPhoto
  };

  console.log(newHistory);

  try {
    const ticket = await TicketModel.findOneAndUpdate(
      { id: ticketId },
      { $push: { history: newHistory } },
      { new: true }
    );

    if (ticket) {
      res.status(200).json({ message: 'History added successfully' });
    } else {
      res.status(404).json({ message: 'Ticket not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}));

export default router;
