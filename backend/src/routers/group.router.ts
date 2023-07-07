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
        try {
            const groupCount = await groupModel.countDocuments();
            console.log(req.body.people);
            const group = new groupModel({
                id: String(groupCount+1),
                groupName: req.body.groupName,
                people: req.body.people
                // people: req.body.people.map((id: number) => String(id))


              });
              console.log(group.groupName);

              groupModel.create(group);
              res.status(201).send(group);
        }
        catch (error) {
            console.log(error);
            res.status(500).send("An error occured during group creation");
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
      // res.status(200).send({message: 'Group name found'});
      res.status(200).send(groupName);
    } else {
      res.status(404).send({ message: 'Group name not found' });
    }

  }));

  router.put('/:groupId/add-users', expressAsyncHandler(async (req, res) => {
    const groupId = req.params.groupId;
    const usersToAdd = req.body.usersToAdd;
  
    console.log('users to add:', usersToAdd);
  
    if (!usersToAdd || usersToAdd.length === 0) {
      res.status(400).send({ message: 'No users provided to be added' });
      return;
    }
  
    const group = await groupModel.findOne({ id: groupId });
    if (!group) {
      res.status(404).send({ message: 'Group not found' });
      return;
    }
  
    const existingPeople = group.people || [];
    const updatedPeople = [...existingPeople, ...usersToAdd.map((userId: string | number | mongoose.mongo.BSON.ObjectId | Uint8Array | mongoose.mongo.BSON.ObjectIdLike | undefined) => new Types.ObjectId(userId))];
  
    await groupModel.findOneAndUpdate(
      { id: groupId },
      { people: updatedPeople },
      { new: true }
    );
  
    res.status(200).send({ message: 'Users added successfully' });
  }));

  router.delete("/:groupId/delete", expressAsyncHandler(async (req, res) => {
    const groupId = req.params.groupId;
  
    const group = await groupModel.findOne({ id: groupId });
    if (!group) {
      res.status(404).send({ message: "Group not found" });
      return;
    }
  
    await groupModel.deleteOne({ id: groupId });
    res.status(200).send({ message: "Group deleted successfully" });
  }));


export default router;