import "mocha"
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/server";

import { TicketModel } from "../src/models/ticket.model";
import mongoose from "mongoose";
import { server } from "../src/server";

chai.use(chaiHttp);
chai.should();
const expect = chai.expect;

//DELETE THE CONTENTS OF THE DATABASE BEFORE THE TEST (Remember, we are using a test DB, so this is OK) 
before(async () => {
    await TicketModel.deleteMany({});
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
            .get('/api/ticket');
            // chai.expect(res.text).to.equal(`{"message":"Welcome to the server!"}`);
        
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.should.have.lengthOf(0);
    });

    it('should POST sample_tickets data...', async () => {
        // let tickets = [
        //     {
        //         id: "Test ID",
        //         summary: "Test summary",
        //         assignee: "Test assignee",
        //         assigned: "Test assigned",
        //         group: "Test group",
        //         priority: "Test priority",
        //         startDate: "Test start date",
        //         endDate: "Test end date",
        //         status: "Test status",
        //     },
        //     {
        //         id: "Test ID",
        //         summary: "Test summary",
        //         assignee: "Test assignee",
        //         assigned: "Test assigned",
        //         group: "Test group",
        //         priority: "Test priority",
        //         startDate: "Test start date",
        //         endDate: "Test end date",
        //         status: "Test status",
        //     }
        // ];


        const res = await chai.request(app)
            .post('/api/ticket/seed');
            // chai.expect(res.text).to.equal(`{"message":"Welcome to the server!"}`);
        
        res.should.have.status(201);
        res.body.should.be.a('array');
        res.body.should.have.lengthOf(3);
    });


    it('test two values...', () => {
        //actual test content
        let expectedValue = 10;
        let actualValue = 10;

        expect(actualValue).to.be.equal(expectedValue);
    });
})