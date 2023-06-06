import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import ticketRouter from './routers/ticket.router';
import userRouter from './routers/user.router';
import loginRouter from './routers/login.router';
import signupRouter from './routers/signup.router';  // Add this line

import { dbConnection } from "./configs/ticketDB.config";

dbConnection();

const app = express();
app.use(cors({
    credentials: true,
    origin: ["http://localhost:4200"]
}));

app.use(express.json());  // You need this line to parse JSON request bodies

app.use('/api/ticket', ticketRouter);
app.use('/api/user', userRouter);
app.use('/api/login', loginRouter);  // Add login router
app.use('/api/signup', signupRouter);  // Add signup router

app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

const port = 3000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



// async function startServer() {
//   try {
//     await ticketConnection();
//     await userConnection();
//     console.log('Database connections established');

//     app.listen(port, () => {
//       console.log(`Server running on http://localhost:${port}`);
//     });
//   } catch (error) {
//     console.log('Error occurred while connecting to the database', error);
//   }
// }

// startServer();
