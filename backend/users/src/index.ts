import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import userRouter from './controllers/user.router'

import { dbConnection } from "./configs/userDB.config";

dbConnection();

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/user', userRouter);

app.get('/api/welcome', (req: any, res :any) => {
    res.status(200).send({ message: 'Welcome to the user service!' });
});

const port = process.env.PORT || 3002;

let server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

export {app as default, server};