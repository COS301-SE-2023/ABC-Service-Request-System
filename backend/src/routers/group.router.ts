import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { TicketModel } from "../models/ticket.model";
import { sample_groups } from "../sampleGroups";
import mongoose from "mongoose";
import { comment } from "../models/ticket.model";
import multer from 'multer';
import { cloudinary } from '../configs/cloudinary';
import { groupModel } from "../models/group.model";

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

export default router;