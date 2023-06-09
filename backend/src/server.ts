import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
//test
import ticketRouter from './routers/ticket.router';
import userRouter from './routers/user.router';
import loginRouter from './routers/login.router';
import signupRouter from './routers/signup.router'; 
import notificationsRouter from './routers/notifications.router';

//test routers
import testTicketRouter from './test_routers/testTicket.router';
import testUserRouter from './test_routers/testUser.router';
import testNotificationsRouter from './test_routers/testNotifications.router';

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
app.use('/api/notifications', notificationsRouter);

//test routers
app.use('/api/test_ticket', testTicketRouter);
app.use('/api/test_user', testUserRouter);
app.use('/api/test_notifications', testNotificationsRouter);

app.get('/api/welcome', (req: any, res :any) => {
    res.status(200).send({ message: 'Welcome to the server!' });
});

const port = 3000;

let server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export {app as default, server};
