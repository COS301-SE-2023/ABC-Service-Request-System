import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { ClientModel, request, requestSchema } from "../models/client.model";
import { project } from "../models/client.model";
import crypto from "crypto";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import { jwtVerify } from "../middleware/jwtVerify";
import bcrypt from 'bcryptjs';
import cli from "@angular/cli";
import jwt from 'jsonwebtoken';

const router = Router();

router.get('/', jwtVerify(['Admin', 'Manager']), expressAsyncHandler(
    async (req, res) => {
        const clients = await ClientModel.find();
        res.status(200).send(clients);
    }
));

//fetch all clients belonging to a specific organisation
router.get('/organisation', jwtVerify(['Admin', 'Manager']) , expressAsyncHandler(
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

//fetch client by their id
router.get(`/id`, expressAsyncHandler(
    async (req, res) => {
        const clientId = req.query.id;

        const client = await ClientModel.findOne({id: clientId});

        if(client){
            res.status(200).send(client);
        } else {
            res.status(404).send({message: 'Client not found with that ID'});
        }
    }
))

//fetch all clients containing assigned groups
router.get('/group', jwtVerify(['Admin', 'Manager', 'Functional', 'Technical']), expressAsyncHandler(
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
router.get('/project', jwtVerify(['Admin', 'Manager']), expressAsyncHandler(
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

//fetch the project given the project objectId
router.get('/project/id', jwtVerify(['Admin', 'Manager']), expressAsyncHandler(
    async (req, res) => {
        let projectId = req.query.projectId;

        projectId = projectId?.toString();

        const project = await ClientModel.aggregate([
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

        if (project) {
            res.status(200).send({ project });
        } else {
            res.status(404).send({ message: 'No project found with that projectId' });
        }
    }
));

//fetch the project given the project id and the client id
router.get('/project/client', jwtVerify(['Admin', 'Manager']), expressAsyncHandler(
    async (req, res) => {
        const projectId = req.query.projectId;
        const clientId = req.query.clientId;

        const clients = await ClientModel.find();

        clients.forEach(client => {
            if(client.id == clientId) {
                client.projects.forEach(project => {
                    if(project.id == projectId) {
                        res.status(200).send(project);
                        return;
                    }
                })
            }
        });

        res.status(404).send({ message: 'No project found with that projectId' });
    }
));

//remove a group from a project given the project id, group id and client id
router.put("/remove_group", jwtVerify(['Admin', 'Manager']), expressAsyncHandler(
    async (req, res) => {
        const projectId = req.body.projectId;
        const groupsToRemove = req.body.groupsToRemove;
        const clientId = req.body.clientId;

        console.log("projectId: ", projectId);
        console.log("groupName: ", groupsToRemove);
        console.log("clientId: ", clientId);


        try {
            const client = await ClientModel.findOne({id: clientId});

            if(client){
                console.log("client found");
                const project = client.projects.find((project) => {
                    return project.id == projectId;
                });

                if(project){
                    console.log("project found: ", project);

                    project.assignedGroups = project.assignedGroups?.filter((group) => {
                        return !groupsToRemove.includes(group.groupName);
                    });

                    console.log("assigned groups: ", project.assignedGroups);
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
router.post("/add_group", jwtVerify(['Admin', 'Manager']), expressAsyncHandler(
    async (req, res) => {
        console.log('req body: ', req.body);
        const clientId = req.body.clientId;
        const projectId = req.body.projectId;
        const newGroups: any = req.body.newGroups;

        try{
            console.log("received client id: ", clientId);
            const client = await ClientModel.findOne({ id: clientId });

            if(client) {
                const project = client.projects.find((project) => {
                    return project.id == projectId;
                });

                if(project) {
                    project.assignedGroups?.push(...newGroups);
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
router.post("/add_project",jwtVerify(['Admin', 'Manager']), expressAsyncHandler(
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

router.post("/ticket_request", expressAsyncHandler(
    async (req, res) => {
        const clientId = req.body.clientId;

        const newRequest: request = {
            id: '',
            type: 'New Ticket Request',
            status: 'Pending',
            projectSelected: req.body.projectSelected,
            summary: req.body.summary,
            description: req.body.description,
            priority: req.body.priority
        }

        try {
            const client = await ClientModel.findOne({id: clientId});
        } catch (error) {
            res.status(500).send("Internal server error adding ticket request to client");
        }
    }
));

//MAKE A PROJECT REQUEST
router.post("/project_request", expressAsyncHandler(
    async (req, res) => {
        const clientId = req.body.clientId;

        const newRequest: request = {
            id: '',
            type: 'New Project Request',
            status: 'Pending',
            additionalInformation: req.body.additionalInformation,
            projectName: req.body.projectName
        }

        try {
            const client = await ClientModel.findOne({id: clientId});

            if(client) {
                if(client.requests) {
                    newRequest.id = Date.now().toString();

                    client.requests.push(newRequest);
                    await client.save();

                    res.status(200).send(client);
                } else {
                    let requests: request[] = [];
                    requests.push(newRequest);
                    client.requests = requests;
                    await client.save();

                    res.status(200).send(client);
                }
            } else {
                res.status(404).send("Client does not exist");
            }
        } catch (error) {
            res.status(500).send("Internal server error adding request to client");
        }
    }
));

router.get("/all_requests", expressAsyncHandler(
    async(req, res) => {
        try{
       
            const clients = await ClientModel.find({requests: {$exists: true, $not: { $size: 0}}});
    
            res.status(200).send(clients);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
));

router.put("/update_request", expressAsyncHandler(
    async (req, res) => {
        const clientId = req.body.clientId;

        const client = await ClientModel.findOne({id: clientId});

        if(client) {
            const request = client.requests.find((request) => {
                return request.id == req.body.requestId;
            });

            if(request) {
                request.status = req.body.status;

                await client.save();
                res.status(200).send(request);
            } else {
                res.status(404).send('Request not found');
            }
        } else {
            res.status(404).send('Client not found');
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


router.post("/create_client", jwtVerify(['Admin', 'Manager']), expressAsyncHandler(
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
            profilePhoto: "https://res.cloudinary.com/ds2qotysb/image/upload/v1687775046/n2cjwxkijhdgdrgw7zkj.png",
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
                        <a href="http://localhost:3000/api/client/activate_account?token=${inviteToken}" class="activation-link">Activate Account</a>
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

router.get('/activate_account', expressAsyncHandler(
    async (req, res) => {
        try{  
            const inviteToken = req.query.token;
    
            const user = await ClientModel.findOne({ inviteToken });

            if (!user) {
                res.status(409).send('Invalid token.');
                return;
            }else{
                res.redirect(`http://localhost:4200/activate_account/${inviteToken}/client`);
            }
        }catch(error){
            // console.log(error);
        }
    }
));

router.post('/activate_account', expressAsyncHandler(
    async(req, res) => {
        try {
            const { inviteToken, password } = req.body;

            const client = await ClientModel.findOne({ inviteToken });

            if (!client) {
                //   console.log('Invalid token');
                  res.status(409).send('Invalid token.');
                  return;
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            client.password = hashedPassword;
            client.emailVerified = true; // Assuming the activation also verifies the email
            client.inviteToken = undefined;

            await client.save();
            const secretKey = "Jetpad2023";
            const token = jwt.sign(
                { _id: client._id },
                secretKey,
                { expiresIn: '1d' }
            );

            res.status(201).send({ message: 'Account activated successfully' });
        }catch (error) {
            res.status(500).send('An error occurred during account activation.');
        }
    }
));

router.post("/login", expressAsyncHandler(
    async (req, res) => {
        try {
            const client = await ClientModel.findOne({email: req.body.email}).select("+password");

            if(client) {
                console.log("found");
                const validPassword = await bcrypt.compare(req.body.password, client?.password!);

                if (!validPassword) {
                    console.log("Invalid password");
                    res.status(401).send({ auth: false, token: null });
                    return;
                }
    
                console.log("validated");
                const secretKey = process.env.JWT_SECRET;
    
                if (!secretKey) {
                    console.log("JWT Secret is not defined");
                    throw new Error('JWT Secret is not defined');
                }
    
    
                const token = jwt.sign({ _id: client?._id , client: client, name: client?.name , objectName: "UserInfo"}, secretKey, {
                    expiresIn: 86400, // expires in 24 hours
                });
    
                console.log("Token:", token);
    
                res.status(200).send({ auth: true, token, client: client});
            }else {
                console.log(req.body.email);
                // console.log("User not found");
                res.status(404).send("No user found.");
            }

        } catch (error) {
            res.status(500).send("An error occurred during login.");
        }
    }
))

export default router;