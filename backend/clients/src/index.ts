import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import clientRouter from "./controllers/client.router";

import { dbConnection } from "./configs/client.config";

dbConnection();

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/client', clientRouter);

app.get('/api/welcome', (req: any, res :any) => {
    res.status(200).send({ message: 'Welcome to the client service!' });
});

// Error handling middleware
// app.use((err: any, req: any, res: any, next: any) => {
//     // Handle request abort error
//     if (req.aborted) {
//       console.error('Request aborted:', req.url);
//       return res.status(400).send('Bad Request: Request aborted');
//     }
  
//     // Handle other errors
//     console.error('Something went wrong:', err);
//     res.status(500).send('Internal Server Error');
//   });

const port = process.env.PORT || 3005;

let server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

export {app as default, server};