import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { UserModel } from "../models/user.model";
import { sample_users } from "../sampleUsers";  // Replace this with your actual sample user data

import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from 'bcryptjs';

const router = Router();

router.get('/', expressAsyncHandler(
    async (req, res) => {
        const users = await UserModel.find();
        res.send(users);
    }
));

router.get('/seed', expressAsyncHandler(
    async (req, res) => {
        const usersCount = await UserModel.countDocuments();
        if(usersCount > 0){
            res.send("Seed is already done");
            return;
        }

        await UserModel.create(sample_users);
        res.json("Seed is done!");
    }
));

router.get('/delete', expressAsyncHandler(
    async (req, res) => {
        await UserModel.deleteMany({});
        res.send("Delete is done!");
    }
));


//JAIMENS ROUTES//

//RESET PASSWORD TO ACTIVATE ACCOUNT//
router.get('/activate_account', expressAsyncHandler(
    async (req, res) => {
      try{
          const token = req.query.token;
          res.status(200).send({ message: 'User created successfully', inviteToken: token });
      }catch(error){
        console.log(error);
      }
      
    })
);

//CREATING A USER//
router.post("/create_user", expressAsyncHandler(
    async (req, res) => {
        try {
            console.log("User creation request received:", req.body);

            // check if a user with the provided email already exists
            const existingUser = await UserModel.findOne({ emailAddress: req.body.emailAddress });

            if (existingUser) {
                console.log("User with this email already exists");
                res.status(409).send("User with this email already exists.");
                return;
            }

            // generate invite token
            const inviteToken = crypto.randomBytes(32).toString("hex");

            // create new user with pending status
            const newUser = new UserModel({
                name: req.body.name,
                surname: req.body.surname,
                profilePhoto: req.body.profilePhoto,
                emailAddress: req.body.emailAddress,
                inviteToken,
                status: "pending",
                roles: req.body.roles,
                groups: req.body.groups,
                password: "Admin"
            });

            await newUser.save();

            // Send the invitation email here, inside the same function where newUser and inviteToken are available
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            const mailOptions = {
                from: process.env.EMAIL,
                to: newUser.emailAddress,
                subject: "Invitation to join our application",
                html: `Please use this token to complete your signup process: <a href="http://localhost:3000/api/user/activate_account?token=${inviteToken}">Click Here</a>`
            };
            

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            });

            console.log("User created successfully");
            res.status(201).send({ message: 'User created successfully', inviteToken });
        } catch (error) {
            console.error("User creation error:", error);
            res.status(500).send("An error occurred during user creation.");
        }
    })
);

//ACTIVATE THE ACCOUNT WITH THE NEW PASSWORD//
router.post('/activate_account', expressAsyncHandler(
    async (req, res) => {
      try {
        console.log('Account activation request received:', req.body);
  
        const { inviteToken, password } = req.body;
        
  
        const user = await UserModel.findOne({ inviteToken });
  
        if (!user) {
          console.log('Invalid token');
          res.status(409).send('Invalid token.');
          return;
        }
  
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
  
        user.password = hashedPassword;
        user.emailVerified = true; // Assuming the activation also verifies the email
        user.inviteToken = undefined;
  
        await user.save();
  
        console.log('Account activated successfully');
        res.status(201).send({ message: 'Account activated successfully' });
      } catch (error) {
        console.error('Account activation error:', error);
        res.status(500).send('An error occurred during account activation.');
      }
      console.log(req.body);
    })
  );


export default router;
