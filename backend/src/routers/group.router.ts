import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { TicketModel } from "../models/ticket.model";
import { sample_groups } from "../sampleGroups";
import mongoose from "mongoose";
import { comment } from "../models/ticket.model";
import multer from 'multer';
import { cloudinary } from '../configs/cloudinary';
import { groupModel } from "../models/group.model";
import { UserModel } from "../models/user.model";

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
  
  

export default router;