import express from "express";
import cors from "cors";
import proxy from 'express-http-proxy';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/ticket', proxy('http://localhost:3001'))
app.use('/user', proxy('http://localhost:3002'))
app.use('/', proxy('http://localhost:3001'))


app.listen(3000, () => {
    console.log('Gateway is listening on port 3000');
});