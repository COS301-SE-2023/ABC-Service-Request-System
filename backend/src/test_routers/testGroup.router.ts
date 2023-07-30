import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { sample_groups } from "../../groups/src/utils/sampleGroups";
import multer from 'multer';
import { cloudinary } from '../configs/cloudinary';
import { testGroupModel } from "./testGroup.model";

const router = Router();

const storage = multer.diskStorage({});
const upload = multer({ storage });


  router.get('/', expressAsyncHandler( //done
      async (req, res) => {
          const groups = await testGroupModel.find();
          res.status(200).send(groups);
      }
  ));

  router.get('/seed', expressAsyncHandler( //done
      async (req, res) => {
          const groupsCount = await testGroupModel.countDocuments();

          testGroupModel.create(sample_groups)
              .then(data => {res.status(201).send(data)})
              .catch(err => {res.status(500).send({message: err.message}); });
          // res.status(200).send("Seed is done!");
      }
  ));

  router.post('/add', expressAsyncHandler( //dpne
    async (req, res) => {
  
      const maxGroup = await testGroupModel.find().sort({ id: -1 }).limit(1);
      let maxId = 0;
      if (maxGroup.length > 0) {
        maxId = Number(maxGroup[0].id);
      }
  
      const group = new testGroupModel({
        id: String(maxId + 1),
        backgroundPhoto: req.body.backgroundPhoto,
        groupName: req.body.groupName,
        people: req.body.people
      });
  
  
      try {
        const createdGroup = await testGroupModel.create(group);
        res.status(201).send(createdGroup);
      }
      catch (error) {
        res.status(500).send("An error occurred during group creation");
      }
  }  
  ));
  router.delete("/:groupId/user/:userId", expressAsyncHandler(async (req, res) => {
    const groupId = req.params.groupId;
    const userId = req.params.userId;
    
    const group = await testGroupModel.findOne({ id: groupId });
    if (!group) {
      res.status(404).send({ message: "Group not found" });
      return;
    }
  
    const userIndex = group.people!.indexOf(userId);

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
  
    const group = await testGroupModel.findOne({id: groupId});
    if (!group) {
      res.status(404).send({message:"Group not found"});
      return;
    }
  
    const groupName = group.groupName;
    if (groupName) {
      res.status(200).json({groupName: groupName});
    }
  }));
  
  
  router.delete("/:groupId/delete",  expressAsyncHandler(async (req, res) => {
    const groupId = req.params.groupId;
  
    const group = await testGroupModel.findOne({ id: groupId });
    if (!group) {
      res.status(404).send({ message: "Group not found" });
      return;
    }
  
    await testGroupModel.deleteOne({ id: groupId });
    res.status(200).send({ message: "Group deleted successfully" });
  }));

  router.get('/:groupId', expressAsyncHandler(async(req,res) => {
    try {
      const groupId = req.params.groupId;
      const group = await testGroupModel.findOne({id: groupId});
      if (!group) {
        res.status(404).send({message:"Group not found"});
        return;
      } else {
        res.status(200).send(group);
      }

    } catch (error) {
      res.status(500).send({ error: 'Internal server error' });
    }
  }))


  router.put('/update_tickets', expressAsyncHandler(async(req,res) => {
    try {
      const ticketId = req.body.ticketId;
      const group = await testGroupModel.findOneAndUpdate({id: req.body.groupId}, {$push : {tickets: ticketId}});
      
      if (group) {
        res.status(200).send({message:"Ticket added to group", group: group});
      } else {
        res.status(404).send("invalid group id");
      }

    } catch (error) {
      res.status(500).send({ error: 'Internal server error' });
    }
  }));

  router.get('/exists/:groupName', expressAsyncHandler(
    async (req, res) => {
        const groupExists = await testGroupModel.exists({ groupName: req.params.groupName });
        res.status(200).send(groupExists);
    }
  ));




export default router;