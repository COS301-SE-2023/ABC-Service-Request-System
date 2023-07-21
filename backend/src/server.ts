import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();
//test
import loginRouter from './routers/login.router';
import signupRouter from './routers/signup.router'; 

//test routers
import testTicketRouter from './test_routers/testTicket.router';
import testUserRouter from './test_routers/testUser.router';
import testNotificationsRouter from './test_routers/testNotifications.router';
import testGroupRouter from './test_routers/testGroup.router'

import { dbConnection } from "./configs/userDB.config";

dbConnection();

const app = express();

app.use(cors({
    credentials: true,
    origin: ["http://localhost:4200"]
}));

app.use('/api/ticket', createProxyMiddleware({ 
  target: 'http://localhost:3001', 
  onError: function onError(err, req, res) {
    console.error('Something went wrong with the proxy middleware', err)
  },
  changeOrigin: true,
}));

app.use('/api/user', createProxyMiddleware({ 
  target: 'http://localhost:3002', 
  pathRewrite: {
      '^/api/user': '/api/user',
  },
  changeOrigin: true,
}));

app.use('/api/group', createProxyMiddleware({ 
  target: 'http://localhost:3003', 
  pathRewrite: {
      '^/api/group': '/api/group',
  },
  changeOrigin: true,
}));

app.use('/api/notifications', createProxyMiddleware({ 
  target: 'http://localhost:3004', 
  pathRewrite: {
      '^/api/notifications': '/api/notifications',
  },
  changeOrigin: true,
}));

app.use(express.json());

app.use('/api/client', createProxyMiddleware({ 
  target: 'http://localhost:3005', 
  onError: function onError(err, req, res) {
    console.error('Something went wrong with the proxy middleware', err);
    res.status(500).send('Something went wrong with the proxy middleware');
  },
  changeOrigin: true,
}));

// // Error handling middleware
// app.use((err: any, req: any, res: any, next: any) => {
//   // Handle request abort error
//   if (req.aborted) {
//     console.error('Request aborted:', req.url);
//     return res.status(400).send('Bad Request: Request aborted');
//   }

//   // Handle other errors
//   console.error('Something went wrong:', err);
//   res.status(500).send('Internal Server Error');
// });

app.use('/api/login', loginRouter);
app.use('/api/signup', signupRouter); 

//test routers
app.use('/api/test_ticket', testTicketRouter);
app.use('/api/test_user', testUserRouter);
app.use('/api/test_notifications', testNotificationsRouter);
app.use('/api/test_group', testGroupRouter);

app.get('/api/welcome', (req: any, res :any) => {
    res.status(200).send({ message: 'Welcome to the server!' });
});


const port = 3000;

let server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export {app as default, server};
