import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { TicketModel } from "../models/ticket.model";
import { sample_groups } from "../sampleGroups";
import mongoose, { Types } from "mongoose";
import { comment } from "../models/ticket.model";
import multer from 'multer';
import { cloudinary } from '../configs/cloudinary';
import { groupModel } from "../models/group.model";
import { UserModel, user } from "../models/user.model";

const router = Router();

const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }
      console.log('in upload router');
      const result = await cloudinary.uploader.upload(req.file.path);
      res.status(200).json({ url: result.secure_url });
    } catch (error) {
      res.status(500).json({ message: 'File upload error' });
    }
});


router.get('/', expressAsyncHandler(
    async (req, res) => {
        const groups = await groupModel.find();
        res.send(groups);
    }
));

router.get('/seed', expressAsyncHandler(
    async (req, res) => {
        const groupsCount = await groupModel.countDocuments();
        if(groupsCount > 0){
            res.status(400).send("Seed is already done");
            return;
        }

        groupModel.create(sample_groups)
            .then(data => {res.status(201).send(data)})
            .catch(err => {res.status(500).send({message: err.message}); });
        // res.status(200).send("Seed is done!");
    }
));

router.post('/add', expressAsyncHandler(
    async (req, res) => {
      console.log('in add  router');

      const groupCount = await groupModel.countDocuments();
      console.log(req.body.people);
      const group = new groupModel({
        id: String(groupCount+1),
        backgroundPhoto: req.body.backgroundPhoto,
        groupName: req.body.groupName,
        people: req.body.people

      });

      console.log(group);

      try {
        const createdGroup = await groupModel.create(group); 
        const users = createdGroup.people;
        // console.log(users);
        if (users) {
          for (let user of users) { 
            const userFromDb = await UserModel.findById(user);
            // console.log('userfromdb: ' + userFromDb);
            if (userFromDb) {
              userFromDb.groups.push(createdGroup.id); 
              await userFromDb.save(); 
            }
          }
        }

        res.status(201).send(createdGroup); 
    }
    catch (error) {
        console.log(error);
        res.status(500).send("An error occurred during group creation");
    }
  }  

));

  router.get("/:groupId/users", expressAsyncHandler(async (req, res) => {
    const groupId = req.params.groupId;
    const group = await groupModel.findOne({ id: groupId });
    console.log(group?.people)
    if (!group) {
      res.status(404).send({ message: "Group not found" });
      return;
    }
  
    const userIds = group.people; 
    const users = await UserModel.find({ _id: { $in: userIds } });
    const userArray = users.map(user => ({ name: user.name, surname: user.surname, emailAddress: user.emailAddress, roles:user.roles[0] })); 
    console.log(userArray);
    res.send(userArray);
    // res.send(group.people);
  }));

  router.get("/:groupId/user/:userId", expressAsyncHandler(async (req, res) => {
    const groupId = req.params.groupId;
    const userId = req.params.userId;

    const group = await groupModel.findOne({ id: groupId });

    console.log(group?.people)
    if (!group) {
      res.status(404).send({ message: "Group not found" });
      return;
    }

    const users = await UserModel.find({ _id: { $in: userId } });
    const userArray = users.map(user => ({ name: user.name, surname: user.surname, emailAddress: user.emailAddress, roles:user.roles })); 
    console.log(userArray);
    res.send(userArray);
    // res.send(group.people);
  }));


router.delete("/:groupId/user/:userEmail", expressAsyncHandler(async (req, res) => {
    const groupId = req.params.groupId;
    const userEmail = decodeURIComponent(req.params.userEmail); 
    console.log('user email decoded: ' + userEmail);
    
    const group = await groupModel.findOne({ id: groupId });
    if (!group) {
      res.status(404).send({ message: "Group not found" });
      return;
    }
    
    const userToRemove = await UserModel.findOne({ emailAddress: userEmail });
    if (!userToRemove) {
      res.status(404).send({ message: 'User not found' });
      return;
    }
  
    const userIndex = group.people!.indexOf(userToRemove._id.toString());
    console.log('user index ' + userIndex)
  
    if (userIndex !== -1) {
      group.people!.splice(userIndex, 1);
      await group.save();
      res.status(200).send({ message: 'User removed successfully' });
    } else {
      res.status(404).send({ message: 'User not found in the group' });
    }
  }));
  
  router.get("/:groupId/name", expressAsyncHandler(async(req,res) => {
    const groupId = req.params.groupId;
  
    const group = await groupModel.findOne({id: groupId});
    if (!group) {
      res.status(404).send({message:"Group not found"});
      return;
    }
  
    const groupName = group.groupName;
    if (groupName) {
      console.log(groupName);
      res.status(200).json({groupName: groupName});
    } else {
      res.status(404).send({ message: 'Group name not found' });
    }
  }));
  

  router.delete("/:groupId/delete", expressAsyncHandler(async (req, res) => {
    const groupId = req.params.groupId;
  
    const group = await groupModel.findOne({ id: groupId });
    if (!group) {
      res.status(404).send({ message: "Group not found" });
      return;
    }
  
    await groupModel.deleteOne({ id: groupId });
    console.log('group deleted');
    res.status(200).send({ message: "Group deleted successfully" });
  }));

  router.put('/add-people', expressAsyncHandler(async(req,res)=>{
    try {
      const { group, people } = req.body;
      console.log('hello from backend');
      console.log(group);
      console.log(people);

      const newGroup = await groupModel.findOneAndUpdate(
        {_id: group},
        {
          $addToSet: {
            people: people,
          }
        },
        {new: true}
      );

      console.log(newGroup);

      if (newGroup) {
        res.status(200).json({message: 'users added to group'});
      } else {
        res.status(404).json({message: 'Group not found'});
      }
    }
    catch (error) {
      res.status(500).send({ error: 'Internal server error' });
    }
  }))

  router.get('/:groupId', expressAsyncHandler(async(req,res) => {
    try {
      const groupId = req.params.groupId;
      const group = await groupModel.findOne({id: groupId});
      if (!group) {
        res.status(404).send({message:"Group not found"});
        return;
      } else {
        // console.log('hiii');
        res.status(200).send(group);
      }

    } catch (error) {
      res.status(500).send({ error: 'Internal server error' });
    }
  }))

  // Edwin's Function
  router.get('/groupId/:id', expressAsyncHandler(async (req, res) => {
    const groupId = req.params.id;
    const group = await groupModel.findById(groupId);
    if (group) {
        res.send(group);
    } else {
        res.status(404).send("Group not found");
    }
}));

  router.put('/update_tickets', expressAsyncHandler(async(req,res) => {
    try {
      const ticketId = req.body.ticketId;
      const group = await groupModel.findOneAndUpdate({id: req.body.groupId}, {$push : {tickets: ticketId}});
      
      if (group) {
        res.status(200).send({message:"Ticket added to group", group: group});
      } else {
        // console.log('hiii');
        res.status(404).send("invalid group id");
      }

    } catch (error) {
      res.status(500).send({ error: 'Internal server error' });
    }
  }))



export default router;