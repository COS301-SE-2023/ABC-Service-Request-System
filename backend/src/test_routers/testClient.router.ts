import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { TestClientModel } from "./testClient.model";
import { project } from "./testClient.model";
import { sample_clients } from "../../clients/src/utils/data";
import crypto from "crypto";
import nodemailer from "nodemailer";
import mongoose from "mongoose";

const router = Router();

router.get('/', expressAsyncHandler(
    async (req, res) => {
        const clients = await TestClientModel.find();
        res.status(200).send(clients);
    }
));

router.post('/seed', expressAsyncHandler(
    async (req, res) => {
        const clientsCount = await TestClientModel.countDocuments();
        if(clientsCount > 0){
            res.status(400).send({message: "Seed is already done"});
            return;
        }

        TestClientModel.create(sample_clients)
            .then(data => {res.status(201).send(data)})
            .catch(err => {res.status(500).send({message: err.message}); });
        // res.status(200).send("Seed is done!");
    }
));

//fetch all clients belonging to a specific organisation
router.get('/organisation', expressAsyncHandler(
    async (req, res) => {
        const organisation = req.query.organisation

        const clients = await TestClientModel.find({organisation: organisation});

        if(clients.length != 0) {
            res.status(200).send(clients);
        } 

        if(clients.length === 0)
            res.status(404).send({message: 'No clients found by that organisation name'});
    }
));

//fetch all clients containing assigned groups
router.get('/group', expressAsyncHandler(
    async (req, res) => {
        const groupName = req.query.group

        try {
            const clients = await TestClientModel.find({'projects.assignedGroups.groupName': groupName});

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
        const clients = await TestClientModel.find({});

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

//fetch the project given the project objectId
router.get('/project/id', expressAsyncHandler(
    async (req, res) => {
        let projectId = req.query.projectId;

        projectId = projectId?.toString();

        const project = await TestClientModel.aggregate([
            {
                $unwind: "$projects" // Unwind the projects array
            },
            {
                $match: {
                    "projects._id": new mongoose.Types.ObjectId(projectId)
                }
            },
            {
                $replaceRoot: {
                    newRoot: "$projects"
                }
            }
        ]);

        if (project.length != 0) {
            res.status(200).send({ project });
        } else {
            res.status(404).send({ message: 'No project found with that projectId' });
        }
    }
));

//fetch the project given the project id and the client id
router.get('/project/client', expressAsyncHandler(
    async (req, res) => {
        const projectId = req.query.projectId;
        const clientId = req.query.clientId;

        const clients = await TestClientModel.find();

        let found = false;

        clients.forEach(client => {
            if(client.id == clientId) {
                client.projects.forEach(project => {
                    if(project.id == projectId) {
                        found = true;
                        res.status(200).send(project);
                        return;
                    }
                })
            }
        });

        if(!found)
            res.status(404).send({ message: 'No project found with that projectId and/or clientId' });
    }
));

//remove a group from a project given the project id, groups and client id
router.put("/remove_group", expressAsyncHandler(
    async (req, res) => {
        const projectId = req.body.projectId;
        const groupsToRemove = req.body.groupsToRemove;
        const clientId = req.body.clientId;

        try {
            const client = await TestClientModel.findOne({id: clientId});

            if(client){
                const project = client.projects.find((project) => {
                    return project.id == projectId;
                });

                if(project){
                    project.assignedGroups = project.assignedGroups?.filter((group) => {
                        return !groupsToRemove.includes(group.groupName);
                    });

                    await client.save();

                    res.status(200).send(project);
                } else {
                    res.status(404).send({ message: 'Project not found' });
                }
            } else {
                res.status(404).send({ message: 'Client not found' });
            }
        } catch (error) {
            res.status(500).send("Internal server error removing group from clients project");
        }
    }
));

//add a group to a project given the client id and project id
router.post("/add_group", expressAsyncHandler(
    async (req, res) => {
        const clientId = req.body.clientId;
        const projectId = req.body.projectId;
        const newGroups: any = req.body.newGroups;

        try{
            const client = await TestClientModel.findOne({ id: clientId });

            if(client) {
                const project = client.projects.find((project) => {
                    return project.id == projectId;
                });

                if(project) {
                    project.assignedGroups?.push(...newGroups);
                    await client.save();

                    res.status(201).send(project);
                } else {
                    res.status(404).send({ message: 'Project not found' });
                }
    
            } else {
                res.status(404).send({ message: 'Client not found' })
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
            const client = await TestClientModel.findOne({id: clientId});

            if(client) {
                const projectExists = client.projects.some(project => project.name === newProject.name);
                if (projectExists) {
                  res.status(400).send({ message: 'Project name already exists' });
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
        
        try {
            const deletedClient = await TestClientModel.findOneAndDelete({ id: clientId });

            if(deletedClient){
                res.status(200).send(deletedClient);
            } else {
                res.status(404).send({ message: 'Client not found' });
            }
        } catch (error) {
            res.status(500).send("Internal server error deleting client");
        }
    }
));

router.post("/create_client", expressAsyncHandler(
    async (req, res) => {

        const existingUser = await TestClientModel.findOne({ email: req.body.email });
        if (existingUser) {
            res.status(409).send({ message: "User with this email already exists." });
            //return;
        } else {
            // generate invite token
            const inviteToken = crypto.randomBytes(32).toString("hex");
            const clientCount = await TestClientModel.countDocuments();

            const newProject: project = {
                id: '1',
                name: req.body.projectName,
                logo: req.body.logo,
                color: req.body.color,
                assignedGroups: req.body.groups
            }

            // create new client
            const newClient = new TestClientModel({
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

            res.status(201).send({ message: 'Client created successfully', inviteToken, client: newClient});
        }

    }
));

export default router;