import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import expressAsyncHandler from 'express-async-handler';
import { UserModel } from "../models/user.model";
import crypto from "crypto";
import nodemailer from "nodemailer";

const router = Router();

// router.post(
//   "/",
//   expressAsyncHandler(async (req, res) => {
//     try {
//       console.log("User creation request received:", req.body);

//       // check if a user with the provided email already exists
//       const existingUser = await UserModel.findOne({ emailAddress: req.body.emailAddress });

//       if (existingUser) {
//         console.log("User with this email already exists");
//         res.status(409).send("User with this email already exists.");
//         return;
//       }

//       // generate invite token
//       const inviteToken = crypto.randomBytes(32).toString("hex");

//       // create new user with pending status
//       const newUser = new UserModel({
//         name: req.body.name,
//         surname: req.body.surname,
//         profilePhoto: req.body.profilePhoto,
//         emailAddress: req.body.emailAddress,
//         inviteToken,
//         status: "pending",
//         roles: req.body.roles,
//         groups: req.body.groups,
//         password: "Admin"
//       });

//       await newUser.save();

//       // Send the invitation email here, inside the same function where newUser and inviteToken are available
//       const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: process.env.EMAIL,
//           pass: process.env.EMAIL_PASSWORD
//         }
//       });

//       const mailOptions = {
//         from: process.env.EMAIL,
//         to: newUser.emailAddress,
//         subject: "Invitation to join our application",
//         html: `Please use this token to complete your signup process: <a href="http://localhost:3000/api/user/activateAccount?token=${inviteToken}">Click Here</a>`
//       };
      

//       transporter.sendMail(mailOptions, function(error, info) {
//         if (error) {
//           console.log(error);
//         } else {
//           console.log("Email sent: " + info.response);
//         }
//       });

//       console.log("User created successfully");
//       res.status(201).send({ message: 'User created successfully', inviteToken });
//     } catch (error) {
//       console.error("User creation error:", error);
//       res.status(500).send("An error occurred during user creation.");
//     }
//   })
// );


router.get(
  "/api/user/activateAccount",
  expressAsyncHandler(async (req, res) => {

    try{
        const token = req.query.token;
        res.status(200).send({ message: 'User created successfully', inviteToken: token });
   
    }catch(error){
      console.log(error);
    }
    
  })
);



export default router;
