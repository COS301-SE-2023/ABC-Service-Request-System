import dotenv from "dotenv";
dotenv.config();

import express, { Express } from "express";
import cors from "cors";
import { dbConnection } from "./configs/database.config";
dbConnection();

import ticketRouter from './routers/ticket.router'

const app: Express = express();
app.use(cors({
    credentials: true,
    origin: ["http://localhost:4200"]
}));

app.use('/api/ticket', ticketRouter);

app.get('/api/welcome', (req, res) => {
    res.status(200).send({ message: 'Welcome to the server!' });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;