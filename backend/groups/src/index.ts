import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import groupRouter from "./controllers/group.router";

import { dbConnection } from "./configs/groupDB.config";

dbConnection();

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/group', groupRouter);

app.get('/api/welcome', (req: any, res :any) => {
    res.status(200).send({ message: 'Welcome to the group service!' });
});

const port = process.env.PORT || 3003;

let server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

export {app as default, server};