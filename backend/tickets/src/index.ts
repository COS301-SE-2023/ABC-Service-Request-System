import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import ticketRouter from './controllers/ticket.router'

import { dbConnection } from "./configs/ticketDB.config";

dbConnection();

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/ticket', ticketRouter);

app.get('/api/welcome', (req: any, res :any) => {
    res.status(200).send({ message: 'Welcome to the ticket service!' });
});

const port = process.env.PORT || 3001;

let server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

export {app as default, server};