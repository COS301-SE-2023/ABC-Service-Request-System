import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { ClientModel } from "../models/client.model";

import crypto from "crypto";
import nodemailer from "nodemailer";

const router = Router();

router.post("/create_client", expressAsyncHandler(
    async (req, res) => {
        // check if a user with the provided email already exists
        const existingUser = await ClientModel.findOne({ email: req.body.email });
        if (existingUser) {
            res.status(409).send("User with this email already exists.");
            return;
        }

        // generate invite token
        const inviteToken = crypto.randomBytes(32).toString("hex");
        const clientCount = await ClientModel.countDocuments();

        // create new client
        const newClient = new ClientModel({
            id: String(clientCount + 1), // Assign the auto-incremented ID
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            organisation: req.body.organisation,
            industry: req.body.industry,
            projects: req.body.projects,
            password: "Admin"
        });

        await newClient.save();

        //send verification email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "hyperiontech.capstone@gmail.com",
                pass: "zycjmbveivhamcgt"
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: newClient.email,
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
                        <p class="greeting">Hello ${newClient.name},</p>
                        <p class="message">To complete your signup process, please click the button below.</p>
                        <a href="http://localhost:3000/api/user/activate_account?token=${inviteToken}" class="activation-link">Activate Account</a>
                    </div>
                </body>
                </html>
            `,
            attachments: [
                {
                    filename: 'app_logo_transparent.png',
                    path: 'assets/app_logo_transparent.png',
                    cid: 'logo'
                }
            ]
        };

        transporter.sendMail(mailOptions);

        console.log("New client created successfully");
        res.status(201).send({ message: 'Client created successfully', inviteToken, client: newClient});
    }
));

export default router;