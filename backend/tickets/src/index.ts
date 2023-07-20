import express from "express";
import config from "./configs/ticket.config";
import dbConnection from "./connection/ticket.connection";
import cors from "cors";
import ticketApp from "./api/ticket.router";

const StartServer = async() => {
    const app = express();

    await dbConnection();

    app.use(express.json())
    app.use(cors());
    ticketApp(app);

    app.listen(config.PORT, () => {
        console.log(`Tickets is listening on port ${config.PORT}`);
    })
    .on('error', (err) => {
        console.log(err);
        process.exit();
    })
}

StartServer();

// const app = express();

// app.use('/', (req, res) => {
//     res.status(200).send({message: "Welcome to the tickets service"});
// });

// app.listen(3001, () => {
//     console.log('Tickets is listening on port 3001', config.PORT);
// });