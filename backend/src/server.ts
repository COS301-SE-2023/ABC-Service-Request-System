import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import { createProxyMiddleware } from 'http-proxy-middleware';
import proxy = require("express-http-proxy");

dotenv.config();
//test

//test routers
import testTicketRouter from './test_routers/testTicket.router';
import testUserRouter from './test_routers/testUser.router';
import testNotificationsRouter from './test_routers/testNotifications.router';
import testGroupRouter from './test_routers/testGroup.router';
import testClientRouter from './test_routers/testClient.router';

import { dbConnection } from "./configs/testTicketDB.config";

dbConnection();

const app = express();

app.use(cors());

app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");    
  next();
});

let ticketUrl;
let userUrl;
let groupUrl;
let notificationUrl;
let clientUrl;

if (process.env.NODE_ENV === 'production') {
  ticketUrl = "https://luna-ticket-service-production.up.railway.app";
} else {
  ticketUrl = "http://localhost:3001";
}

if (process.env.NODE_ENV === 'production') {
  userUrl = "https://luna-user-service-4883dabf907c.herokuapp.com";
} else {
  userUrl = "http://localhost:3002";
}

if (process.env.NODE_ENV === 'production') {
  groupUrl = "https://luna-group-service-0ebbd0219a30.herokuapp.com";
} else {
  groupUrl = "http://localhost:3003";
}

if (process.env.NODE_ENV === 'production') {
  notificationUrl = "https://luna-notification-service-029a9c4e1fc3.herokuapp.com";
} else {
  notificationUrl = "http://localhost:3004";
}

if (process.env.NODE_ENV === 'production') {
  clientUrl = "https://luna-client-service-d5f98b3f6099.herokuapp.com";
} else {
  clientUrl = "http://localhost:3005";
}


app.use("/api/ticket", proxy(ticketUrl, {
  proxyReqPathResolver: (req) => {
    return `/api/ticket${req.url}`;
  },
}));

app.use("/api/user", proxy(userUrl, {
  proxyReqPathResolver: (req) => {
    return `/api/user${req.url}`;
  },
}));

app.use("/api/group", proxy(groupUrl, {
  proxyReqPathResolver: (req) => {
    return `/api/group${req.url}`;
  },
}));

app.use("/api/notifications", proxy(notificationUrl, {
  proxyReqPathResolver: (req) => {
    return `/api/notifications${req.url}`;
  },
}));

app.use("/api/client", proxy(clientUrl, {
  proxyReqPathResolver: (req) => {
    return `/api/client${req.url}`; // Prefix the request path with /api/user
  },
}));

//test routers
app.use('/api/test_ticket', testTicketRouter);
app.use('/api/test_user', testUserRouter);
app.use('/api/test_notifications', testNotificationsRouter);
app.use('/api/test_group', testGroupRouter);
app.use('/api/test_client', testClientRouter);

app.get('/api/welcome', (req: any, res :any) => {
    res.status(200).send({ message: 'Welcome to the server!' });
});


const port = process.env.PORT || 3000;

let server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export {app as default, server};
