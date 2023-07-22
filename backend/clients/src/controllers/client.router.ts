import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { ClientModel } from "../models/client.model";
import { project } from "../models/client.model";

import crypto from "crypto";
import nodemailer from "nodemailer";


const router = Router();

router.get('/', expressAsyncHandler(
    async (req, res) => {
        const clients = await ClientModel.find();
        res.status(200).send(clients);
    }
));

//fetch all clients belonging to a specific organisation
router.get('/organisation', expressAsyncHandler(
    async (req, res) => {
        const organisation = req.query.organisation

        const clients = await ClientModel.find({organisation: organisation});

        if(clients) {
            res.status(200).send(clients);
        } else {
            res.status(404).send({message: 'No clients found by that organisation name'});
        }
    }
));

//fetch all clients containing assigned groups
router.get('/group', expressAsyncHandler(
    async (req, res) => {
        const groupName = req.query.group

        try {
            const clients = await ClientModel.find({'projects.assignedGroups.groupName': groupName});

            res.status(200).send(clients);
        } catch (error) {
            res.status(500).send("Internal server error getting clients with groupName");
        }
    }
));

//fetch the client given the project name
router.get('/project', expressAsyncHandler(
    async (req, res) => {
        const projectName = req.query.projectName;
        const clients = await ClientModel.find({});

        const filteredClients = clients.filter(client => {
            return client.projects.some(project => project.name === projectName);
        });

        if(filteredClients.length > 0) {
            res.status(200).send(filteredClients[0]);
        } else {
            res.status(404).send({message: 'No clients found with that project name'});
        }
    }
));

//remove a group from a project given the project id, group id and client id
router.put("/remove_group", expressAsyncHandler(
    async (req, res) => {
        const projectId = req.body.projectId;
        const groupId = req.body.groupId;
        const clientId = req.body.clientId;

        try {
            const client = await ClientModel.findOne({id: clientId});

            if(client){
                const project = client.projects.find((project) => {
                    return project.id == projectId;
                });

                if(project){
                    project.assignedGroups = project.assignedGroups?.filter((group) => {
                        return group.id !== groupId;
                    });
                    await client.save();
                    res.status(200).send(project);
                } else {
                    res.status(404).send("Project not found");
                }
            } else {
                res.status(404).send("Client not found");
            }
        } catch (error) {
            res.status(500).send("Internal server error removing group from clients project");
        }
    }
));

//add a group to a project given the client id and project id
router.post("/add_group", expressAsyncHandler(
    async (req, res) => {
        console.log('req body: ', req.body);
        const clientId = req.body.clientId;
        const projectId = req.body.projectId;
        const newGroup: any = req.body.newGroup;

        try{
            console.log("received client id: ", clientId);
            const client = await ClientModel.findOne({ id: clientId });

            if(client) {
                const project = client.projects.find((project) => {
                    return project.id == projectId;
                });

                if(project) {
                    project.assignedGroups?.push(newGroup);
                    await client.save();

                    res.status(201).send(project);
                } else {
                    res.status(404).send("Project not found");
                }
    
            } else {
                res.status(404).send("Client not found")
            }

        } catch (error) {
            res.status(500).send("Internal server error adding group to clients project");
        }
    } 
));

//ADD PROJECT TO EXISTING CLIENT
router.post("/add_project", expressAsyncHandler(
    async (req, res) => {
        const clientId = req.body.clientId;

        const newProject: project = {
            id: '',
            name: req.body.projectName,
            logo: req.body.logo,
            color: req.body.color,
            assignedGroups: req.body.groups
        }

        try{
            const client = await ClientModel.findOne({id: clientId});

            if(client) {
                const projectExists = client.projects.some(project => project.name === newProject.name);
                if (projectExists) {
                  res.status(400).send("Project name already exists");
                  return;
                }

                newProject.id = (client.projects.length + 1).toString();

                client.projects.push(newProject);
                await client.save();

                res.status(200).send(client);
            }
        } catch (error) {
            res.status(500).send("Internal server error adding project to client");
        }
    }
));

//REMOVE A CLIENT GIVEN THE CLIENT ID
router.delete("/delete_client", expressAsyncHandler(
    async (req, res) => {
        const clientId = req.query.clientId;
        console.log('client Id: ', clientId);
        try {
            const deletedClient = await ClientModel.findOneAndDelete({ id: clientId });

            if(deletedClient){
                res.status(200).send(deletedClient);
            } else {
                res.status(404).send("Client not found");
            }
        } catch (error) {
            res.status(500).send("Internal server error deleting client");
        }
    }
));

router.post("/create_client", expressAsyncHandler(
    async (req, res) => {
        // check if a user with the provided email already exists
        console.log('req: ', req.body);
        const existingUser = await ClientModel.findOne({ email: req.body.email });
        if (existingUser) {
            res.status(409).send("User with this email already exists.");
            return;
        }

        // generate invite token
        const inviteToken = crypto.randomBytes(32).toString("hex");
        const clientCount = await ClientModel.countDocuments();

        const newProject: project = {
            id: '1',
            name: req.body.projectName,
            logo: req.body.logo,
            color: req.body.color,
            assignedGroups: req.body.groups
        }

        // create new client
        const newClient = new ClientModel({
            id: String(clientCount + 1), // Assign the auto-incremented ID
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            inviteToken,
            organisation: req.body.organisation,
            industry: req.body.industry,
            projects: newProject,
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

                            <h1>Welcome to Luna</h1>
                        </div>
                        <p class="greeting">Hello ${newClient.name},</p>
                        <p class="message">To complete your signup process, please click the button below.</p>
                        <a href="http://localhost:3000/api/user/activate_account?token=${inviteToken}" class="activation-link">Activate Account</a>
                    </div>
                </body>
                </html>
            `,
            // attachments: [
            //     {
            //         filename: 'luna-logo.png',
            //         path: 'assets/luna-logo.png',
            //         cid: 'logo'
            //     }
            // ]
        };

        transporter.sendMail(mailOptions);

        console.log("New client created successfully");
        res.status(201).send({ message: 'Client created successfully', inviteToken, client: newClient});
    }
));

export default router;