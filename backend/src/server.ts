import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { dbConnection } from "./configs/database.config";
dbConnection();

import ticketRouter from './routers/ticket.router'

const app = express();
app.use(cors({
    credentials: true,
    origin: ["http://localhost:4200"]
}));

app.use('/api/ticket', ticketRouter);

app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
