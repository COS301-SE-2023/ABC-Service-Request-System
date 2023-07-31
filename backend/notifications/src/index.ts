import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import notificationsRouter from "./controllers/notifications.router";

import { dbConnection } from "./configs/notificationsDB.config";

dbConnection();

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/notifications', notificationsRouter);

app.get('/api/welcome', (req: any, res :any) => {
    res.status(200).send({ message: 'Welcome to the notifications service!' });
});

const port = process.env.PORT || 3004;

let server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

export {app as default, server};