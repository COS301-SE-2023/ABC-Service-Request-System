import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { dbConnection as ticketConnection } from "./configs/ticketDB.config";
import { dbConnection as userConnection } from "./configs/userDB.config";
ticketConnection();
userConnection();

import ticketRouter from './routers/ticket.router'
import userRouter from './routers/user.router'

const app = express();
app.use(cors({
    credentials: true,
    origin: ["http://localhost:4200"]
}));

app.use('/api/ticket', ticketRouter);
app.use('api/user', userRouter);

app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
