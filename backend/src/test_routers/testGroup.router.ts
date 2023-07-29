import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { sample_groups } from "../../groups/src/utils/sampleGroups";
import multer from 'multer';
import { cloudinary } from '../configs/cloudinary';
import { testGroupModel } from "./testGroup.model";

const router = Router();

const storage = multer.diskStorage({});
const upload = multer({ storage });

  router.post('/upload', upload.single('file'), async (req, res) => {
      try {
        if (!req.file) {
          res.status(400).json({ message: 'No file uploaded' });
          return;
        }
        const result = await cloudinary.uploader.upload(req.file.path);
        res.status(200).json({ url: result.secure_url });
      } catch (error) {
        res.status(500).json({ message: 'File upload error' });
      }
  });


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
    } else {
      res.status(404).send({ message: 'Group name not found' });
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


  // router.put('/add-people', expressAsyncHandler(async(req,res)=>{
  //   try {
  //     const { group, people } = req.body;


  //     const newGroup = await testGroupModel.findOneAndUpdate(
  //       {_id: group},
  //       {
  //         $addToSet: {
  //           people: people,
  //         }
  //       },
  //       {new: true}
  //     );


  //     if (newGroup) {
  //       res.status(200).json({message: 'users added to group'});
  //     } else {
  //       res.status(404).json({message: 'Group not found'});
  //     }
  //   }
  //   catch (error) {
  //     res.status(500).send({ error: 'Internal server error' });
  //   }
  // }))

//   router.get('/objectId/:groupId', expressAsyncHandler(async (req, res) => {
//     const groupId = req.params.groupId;
//     try {
//         const group = await testGroupModel.findOne({ _id: groupId });
//         if (group) {
//             res.status(200).send(group);
//         } else {
//             res.status(404).send('Group not found');
//         }
//     } catch (error) {
//         res.status(500).send("An error occurred while fetching the group");
//     }
// }));

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

//   router.get('/groupId/:id', expressAsyncHandler(async (req, res) => {
//     const groupId = req.params.id;
//     const group = await testGroupModel.findById(groupId);
//     if (group) {
//         res.send(group);
//     } else {
//         res.status(404).send("Group not found");
//     }
// }));

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