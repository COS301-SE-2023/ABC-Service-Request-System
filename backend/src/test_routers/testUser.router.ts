import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { TestUserModel } from "../models/testUser.model";

import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const router = Router();

router.get('/', expressAsyncHandler(
    async (req, res) => {
        const users = await TestUserModel.find();
        res.send(users);
    }
));

router.get('/seed', expressAsyncHandler(
    async (req, res) => {
        try {
            const usersCount = await TestUserModel.countDocuments();
            if(usersCount > 0){
                res.send("Seed is already done");
                return;
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("admin123", salt);

            const adminUser = {
                name: "Admin",
                surname: "admin",
                profilePhoto: "http://example.com/img/bob.jpg",
                emailAddress: "admin@admin.com",
                emailVerified: true,
                password: hashedPassword,
                roles: ["Admin"],
                groups: ["group1", "group2"]
            };

            const newUser = await TestUserModel.create(adminUser);
            const secretKey = "Jetpad2023";
            // Generate JWT token here, make sure it is the same as the one generated in "activate_account"
            const token = jwt.sign(
                { _id: newUser._id, role: 'Admin' },
                
                secretKey,
                { expiresIn: '1d' }
            );

            // console.log("Token:", token);

            // Send the token back to the client
            res.status(200).json({ message: "Seed is done!", token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error seeding database' });
        }
    }
));



router.get('/delete', expressAsyncHandler(
    async (req, res) => {
        await TestUserModel.deleteMany({});
        res.status(200).send({ message: 'Delete is done' });
    }
));


//JAIMENS ROUTES//

//RESET PASSWORD TO ACTIVATE ACCOUNT//
// router.get('/activate_account', expressAsyncHandler(
//     async (req, res) => {
//       try{
//           const token = req.query.token;
//           res.status(200).send({ message: 'User created successfully', inviteToken: token });
//       }catch(error){
//         console.log(error);
//       }
      
//     })
// );

//CREATING A USER//
router.post("/create_user", expressAsyncHandler(
    async (req, res) => {
        try {
            // console.log("User creation request received:", req.body);

            // check if a user with the provided email already exists
            const existingUser = await TestUserModel.findOne({ emailAddress: req.body.emailAddress });

            if (existingUser) {
                // console.log("User with this email already exists");
                res.status(409).send("User with this email already exists.");
                return;
            }

            // generate invite token
            const inviteToken = crypto.randomBytes(32).toString("hex");

            // create new user with pending status
            const newUser = new TestUserModel({
                name: req.body.name,
                surname: req.body.surname,
                profilePhoto: req.body.profilePhoto || "http://example.com/img/default.jpg",
                emailAddress: req.body.emailAddress,
                inviteToken,
                status: "pending",
                roles: req.body.roles,
                groups: req.body.groups,
                password: "Admin"
            });

            // console.log("before save");
            await newUser.save();
            // console.log("after save");

            // Send the invitation email here, inside the same function where newUser and inviteToken are available
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "hyperiontech.capstone@gmail.com",
                    pass: "zycjmbveivhamcgt"
                }
            });

            const mailOptions = {
                from: process.env.EMAIL,
                to: newUser.emailAddress,
                subject: "Invitation to join Luna",
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
                                color: rgba(122 , 122 , 122 , 1);
                                text-align: center;
                                margin: 20px 0;
                            }
                            .activation-link {
                                display: block;
                                width: 200px;
                                margin: 20px auto;
                                padding: 10px;
                                background-color: rgba(18, 18, 18, 1);
                                color: #fff;
                                text-align: center;
                                text-decoration: none;
                                border-radius: 4px;
                            }
                            a {
                                color: #fff;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="email-container">
                            <div class="header">
                                <img src="cid:logo" alt="Luna Logo" class="logo">
                                <h1>Welcome to Luna</h1>
                            </div>
                            <p class="greeting">Hello ${newUser.name},</p>
                            <p class="message">To complete your signup process, please click the button below.</p>
                            <a href="http://localhost:3000/api/user/activate_account?token=${inviteToken}" class="activation-link">Activate Account</a>
                        </div>
                    </body>
                    </html>
                `,
                attachments: [
                    {
                        filename: 'luna-logo.png',
                        path: 'assets/luna-logo.png',
                        cid: 'logo'
                    }
                ]
            };
            
            
            

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    // console.log(error);
                } else {
                    // console.log("Email sent: " + info.response);
                }
            });

            // console.log("User created successfully");
            res.status(201).send({ message: 'User created successfully', inviteToken });
        } catch (error) {
            // console.error("User creation error:", error);
            res.status(500).send("An error occurred during user creation.");
        }
    })
);


//const token = req.query.token;

///create a router.get to display the component that is suppose to get the new password from the user
router.get('/activate_account', expressAsyncHandler(
    async (req, res) => {
        try{
            // console.log('Account activation request received:', req.query.token);
  
            const inviteToken = req.query.token;
    
            const user = await TestUserModel.findOne({ inviteToken });
            
            // console.log("When in here");

            if (!user) {
                // console.log('Invalid token');
                res.status(409).send('Invalid token.');
                return;
            }else{
                res.redirect(`http://localhost:4200/activate_account/${inviteToken}`);
                // res.status(200).send({ message: 'Token Authenticated', inviteToken: inviteToken });
            }
            

            
        }catch(error){
            // console.log(error);
        }

    }
));


//ACTIVATE THE ACCOUNT WITH THE NEW PASSWORD//
router.post('/activate_account', expressAsyncHandler(
    async (req, res) => {
      try {
        // console.log('Account activation request received:', req.body);
  
        const { inviteToken, password } = req.body;
  
        // console.log('before find one');
        const user = await TestUserModel.findOne({ inviteToken });
        // console.log('after find one');
  
        if (!user) {
        //   console.log('Invalid token');
          res.status(409).send('Invalid token.');
          return;
        }
  
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
  
        user.password = hashedPassword;
        user.emailVerified = true; // Assuming the activation also verifies the email
        user.inviteToken = undefined;
  
        // console.log('before save');
        await user.save();
        const secretKey = "Jetpad2023";
        const token = jwt.sign(
            { _id: user._id, role: user.roles },
            secretKey,
            { expiresIn: '1d' }
        );
  
        // console.log('Account activated successfully');
        res.status(201).send({ message: 'Account activated successfully' });
      } catch (error) {
        console.error('Account activation error:', error);
        res.status(500).send('An error occurred during account activation.');
      }
    //   console.log(req.body);
    })
  );


  router.post('/get_user_by_token', async (req, res) => {
    try {
      const { token } = req.body;
  
      const user = await TestUserModel.findOne({ inviteToken: token });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({ email: user.emailAddress });
    } catch (error) {
      console.error('Error retrieving user by token:', error);
      res.status(500).json({ error: 'An error occurred while retrieving user by token' });
    }
  });

export default router;