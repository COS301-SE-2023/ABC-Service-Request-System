import "mocha"
import mongoose from 'mongoose';
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/server";
import { server } from "../src/server";
import sinon from 'sinon';

import { TestClientModel } from "../src/test_routers/testClient.model";

chai.use(chaiHttp);
chai.should();
const expect = chai.expect;

//DELETE THE CONTENTS OF THE DATABASE BEFORE THE TEST (Remember, we are using a test DB, so this is OK) 
before(async () => {
    await TestClientModel.deleteMany({});
});

after(async () => {
    // await TicketModel.deleteMany({});
    await mongoose.connection.close();
    server.close();
});

describe('/Client test collection', () => {
    it('should verify that we have no clients in the DB...', async () => {
        const res = await chai.request(app)
            .get('/api/test_client');
        
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.should.have.lengthOf(0);
    });

    it('should POST sample_clients data...', async () => {
        const res = await chai.request(app)
            .post('/api/test_client/seed');
        
        res.should.have.status(201);
        res.body.should.be.a('array');
        res.body.should.have.lengthOf(2);
    });

    // it('seed should fail because data already exists...', async () => {
    //     const res = await chai.request(app)
    //         .post('/api/test_client/seed');
        
    //     res.should.have.status(400);
    //     res.body.should.be.a('object');
    //     expect(res.body.message).to.be.equal('Seed is already done');
    // });

    // it('should POST sample_clients data and get a 500 error', async () => {
    //     const sandbox = sinon.createSandbox();
      
    //     sandbox.stub(TestClientModel, 'create').throws(new Error('Mocked error'));
      
    //     try {
    //         const res = await chai.request(app)
    //             .post('/api/test_client/seed');

    //       res.should.have.status(500);
    //       res.body.should.have.property('message').that.is.a('string');
    //       expect(res.body.message).to.be.equal('No clients found by that organisation name');
    //     } catch (err) {

    //     }
      
    //     sandbox.restore();
    // });

    // it('should get all clients belonging to an organisation...', async () => {
    //     let organisation = "Absa";

    //     const res = await chai.request(app)
    //         .get('/api/test_client/organisation')
    //         .query({ organisation: organisation});
        
    //     res.should.have.status(200);
    //     res.body.should.be.a('array');
    //     res.body.should.have.lengthOf(1);
    // });

    // it('should return 404 when invalid organisation is entered...', async () => {
    //     let organisation = "Nothing";

    //     const res = await chai.request(app)
    //         .get('/api/test_client/organisation')
    //         .query({ organisation: organisation});
        
    //     res.should.have.status(404);
    //     res.body.should.be.a('object');
    //     expect(res.body.message).to.be.equal('No clients found by that organisation name');
    // });

    // it('should get all clients belonging to a group...', async () => {
    //     let groupName = "Frontend";

    //     const res = await chai.request(app)
    //         .get('/api/test_client/group')
    //         .query({ group: groupName});
        
    //     res.should.have.status(200);
    //     res.body.should.be.a('array');
    //     res.body.should.have.lengthOf(2);
    // });

    // it('should GET clients by groupName and get a 500 error', async () => {
    //     let groupName = "Nothing";

    //     const sandbox = sinon.createSandbox();
      
    //     sandbox.stub(TestClientModel, 'create').throws(new Error('Mocked error'));
      
    //     try {
    //         const res = await chai.request(app)
    //             .get('/api/test_client/group')
    //             .query({ group: groupName});

    //             res.should.have.status(500);
    //             res.body.should.have.property('message').that.is.a('string');
    //             expect(res.body.message).to.be.equal('Internal server error getting clients with groupName');
    //     } catch (err) {

    //     }
      
    //     sandbox.restore();
    // });

    it('should get client by project name...', async () => {
        let projectName = "Mobile%20Application";

        const res = await chai.request(app)
            .get('/api/test_client/group')
            .query({ group: projectName});
        
            console.log("res is: ", res.body);
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.should.have.lengthOf(1);
        // expect(res.body).to.have.property('project');
        // res.body.project.content.should.be.a('string');
        // expect(res.body.project.content).to.be.equal(projectName);
    });
});