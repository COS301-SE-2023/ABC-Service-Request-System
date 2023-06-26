import "mocha"
import mongoose from 'mongoose';
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/server";
import { server } from "../src/server";

import { TestTicketModel } from "../src/models/testTicket.model";

chai.use(chaiHttp);
chai.should();
const expect = chai.expect;

//DELETE THE CONTENTS OF THE DATABASE BEFORE THE TEST (Remember, we are using a test DB, so this is OK) 
before(async () => {
    await TestTicketModel.deleteMany({});
});

after(async () => {
    // await TicketModel.deleteMany({});
    await mongoose.connection.close();
    server.close();
});

describe('/First test collection', () => {
    it('test welcome route...', async () => {
        const res = await chai.request(app)
            .get('/api/welcome');
            chai.expect(res.text).to.equal(`{"message":"Welcome to the server!"}`);
            //IF WE DONT WANT TO CHECK FOR AN OBJECT AND JUST WANT TO CHECK FOR THE STRING:
            const actualValue = res.body.message;
            chai.expect(actualValue).to.be.equal("Welcome to the server!");
            //////////////////////////////////////////////////////////////////////////////

        res.body.should.be.a('object');
        res.should.have.status(200);
    });

    it('should verify that we have no tickets in the DB...', async () => {
        const res = await chai.request(app)
            .get('/api/test_ticket');
        
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.should.have.lengthOf(0);
    });

    it('should POST sample_tickets data...', async () => {
        const res = await chai.request(app)
            .post('/api/test_ticket/seed');
        
        res.should.have.status(201);
        res.body.should.be.a('array');
        res.body.should.have.lengthOf(3);
    });

    it('should check that comments for user 1 is empty at first...', async () => {
        let userId = '1';

        const res = await chai.request(app)
            .get('/api/test_ticket/id')
            .query({ id: userId});

        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('comments');
        res.body.comments.should.be.a('array');
        res.body.comments.should.have.lengthOf(0);
    });

    it('should add a comment to user 1...', async () => {

        const toSend = {
            ticketId: '1',
            comment: 'hi',
            author: 'John',
            type: 'comment'
        }

        const res = await chai.request(app)
            .put('/api/test_ticket/comment')
            .send(toSend);

        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(res.body.message).to.be.equal('Comment added successfully');
    });

    it('should check that comments for user 1 is has a single item and the content of the message should be "hi"...', async () => {
        let userId = '1';

        const res = await chai.request(app)
            .get('/api/test_ticket/id')
            .query({ id: userId});

        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('comments');
        res.body.comments.should.be.a('array');
        res.body.comments.should.have.lengthOf(1);
        expect(res.body.comments[0]).to.have.property('content');
        res.body.comments[0].content.should.be.a('string');
        expect(res.body.comments[0].content).to.be.equal('hi');
    });

    it('should return 404 when an invalid ticket ID is being accessed...', async () => {
        let userId = '20';

        const res = await chai.request(app)
            .get('/api/test_ticket/id')
            .query({ id: userId});

        res.should.have.status(404);
        res.body.should.be.a('object');
        expect(res.body.message).to.be.equal('Id not found');
    });
})