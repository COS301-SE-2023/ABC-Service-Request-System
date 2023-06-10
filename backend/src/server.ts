import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
//test
import ticketRouter from './routers/ticket.router';
import userRouter from './routers/user.router';
import loginRouter from './routers/login.router';
import signupRouter from './routers/signup.router'; 

import { dbConnection } from "./configs/ticketDB.config";

dbConnection();

const app = express();

app.use(cors({
    credentials: true,
    origin: ["http://localhost:4200"]
}));

app.use(express.json());

app.use('/api/ticket', ticketRouter);
app.use('/api/user', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/signup', signupRouter); 

app.get('/api/welcome', (req:any, res:any) => {
    res.status(200).send({ message: 'Welcome to the server!' });
});

const port = 3000;

let server = app.listen(port, () => {
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

export {app as default, server};

