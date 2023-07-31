import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { TestClientModel } from "./testClient.model";
import { project } from "./testClient.model";
import { sample_clients } from "../test_samples/test_client_sample";
import crypto from "crypto";
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
    }
));

//add a group to a project given the client id and project id
router.post("/add_group", expressAsyncHandler(
    async (req, res) => {
        const clientId = req.body.clientId;
        const projectId = req.body.projectId;
        const newGroups: any = req.body.newGroups;

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
    }
));

//REMOVE A CLIENT GIVEN THE CLIENT ID
router.delete("/delete_client", expressAsyncHandler(
    async (req, res) => {
        const clientId = req.query.clientId;
        
        const deletedClient = await TestClientModel.findOneAndDelete({ id: clientId });

        if(deletedClient){
            res.status(200).send(deletedClient);
        } else {
            res.status(404).send({ message: 'Client not found' });
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

            res.status(201).send({ message: 'Client created successfully', inviteToken, client: newClient});
        }

    }
));

export default router;