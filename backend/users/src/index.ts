import express from "express";

const app = express();

app.use('/', (req, res) => {
    res.status(200).send({message: "Welcome to the users service"});
});

app.listen(3002, () => {
    console.log('Users is listening on port 3002');
});