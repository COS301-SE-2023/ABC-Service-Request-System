import "mocha"
import mongoose from 'mongoose';
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/server";
import { server } from "../src/server";
import { testGroupModel, group } from '../../backend/src/test_routers/testGroup.model';
import sinon from 'sinon';
import cloudinary from 'cloudinary';

const cloudinaryStub = sinon.stub(cloudinary.v2.uploader, 'upload');
chai.use(chaiHttp);
chai.should();
const expect = chai.expect;

//DELETE THE CONTENTS OF THE DATABASE BEFORE THE TEST (Remember, we are using a test DB, so this is OK) 
before(async () => {
    await testGroupModel.deleteMany({});
});

after(async () => {
    // await TicketModel.deleteMany({});
    await mongoose.connection.close();
    server.close();
    cloudinaryStub.restore();
});

describe ('/Group test collection',() => {
    it('should test welcome route...', async () => {
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

    it('should verify that we have no groups in the DB...', async () => {
        const res = await chai.request(app)
            .get('/api/test_group');
        
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.should.have.lengthOf(0);
    });

    it('should seed the database...', async () => {
        const res = await chai.request(app)
          .get('/api/test_group/seed');
        
        res.should.have.status(201);
        res.body.should.be.a('array');
        res.body.should.have.lengthOf(2);
      });

      it('should return all groups...', async () => {
        const res = await chai.request(app)
          .get('/api/test_group');
        
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.should.have.lengthOf(2);
      });

      it('should add a new group...', async () => {
        const res = await chai.request(app)
          .post('/api/test_group/add')
          .send({
            groupName: "Test Group",
            backgroundPhoto: "http://example.com/bg.jpg",
            people: ["6078fd71cd9e35a06b1b7f1f", "6078fd71cd9e35a06b1b7f20"]
          });
    
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.should.have.property('groupName').eql('Test Group');
      });

      it('should not add a new group & report an internal server error...', async () => {
        const res = await chai.request(app)
          .post('/api/test_group/add')
          .send({

          });
    
        res.should.have.status(500);
        // res.body.should.be.a('object');
        // res.body.should.have.property('id');
        // res.body.should.have.property('groupName').eql('Test Group');
      });

    let createdGroupId = 1;
    let createdUserId = '6078fd71cd9e35a06b1b7f1b'; 

    it('should get group name by ID', async () => {
        const res = await chai.request(app)
            .get(`/api/test_group/1/name`);

        res.should.have.status(200);
        // res.body.should.hav('Group 1');
    });
    
    it('should not get group name by ID that does not exist', async () => {
        const res = await chai.request(app)
            .get(`/api/test_group/999/name`);

        res.should.have.status(404);
        // res.body.should.hav('Group 1');
    });

    // it('should add people to group', async () => {
    //     const payload = {
    //         group: createdGroupId,
    //         people: [createdUserId]
    //     };
    //     const res = await chai.request(app)
    //         .put('/api/test_group/add-people')
    //         .send(payload);

    //     res.should.have.status(200);
    //     res.body.message.should.equal('users added to group');
    // });

    it('should update group tickets', async () => {
        const payload = {
            groupId: createdGroupId,
            ticketId: 'Test Ticket Id'
        };
        const res = await chai.request(app)
            .put('/api/test_group/update_tickets')
            .send(payload);

        res.should.have.status(200);
        res.body.message.should.equal('Ticket added to group');
    });

    it('should not update group tickets of a group that does not exist...', async () => {
        const payload = {
            groupId: '999',
            ticketId: 'Test Ticket Id'
        };
        const res = await chai.request(app)
            .put('/api/test_group/update_tickets')
            .send(payload);

        res.should.have.status(404);
        // res.body.message.should.equal('invalid group id');
    });

    // it('should report internal server error for update_tickets...', async () => {
    //     const payload = {
    //         test: '999',
    //         test1: 'Test Ticket Id'
    //     };
    //     const res = await chai.request(app)
    //         .put('/api/test_group/update_tickets')
    //         .send(payload);

    //     res.should.have.status(500);
    //     // res.body.message.should.equal('Ticket added to group');
    // });


    it('should remove user from group...', async () => {
        const res = await chai.request(app)
            .delete(`/api/test_group/${createdGroupId}/user/${createdUserId}`);

        res.should.have.status(200);
        res.body.message.should.equal('User removed successfully');
    });

    it('should not remove user that is not from group...', async () => {
        const res = await chai.request(app)
            .delete(`/api/test_group/${createdGroupId}/user/9999`);

        res.should.have.status(404);
        res.body.message.should.equal('User not found in the group');
    });

    it('should not remove user from group that does not exist...', async () => {
        const res = await chai.request(app)
            .delete(`/api/test_group/999/user/${createdUserId}`);

        res.should.have.status(404);
        // res.body.message.should.equal('Group not found');
    });

    it('should get group by ID', async () => {
        const res = await chai.request(app)
            .get(`/api/test_group/${createdGroupId}`);

        res.should.have.status(200);
        res.body.should.be.a('object');
    });

    it('should not get group that does not exist by ID', async () => {
        const res = await chai.request(app)
            .get(`/api/test_group/999`);

        res.should.have.status(404);
        // res.body.should.be.a('object');
    });

    // it('should not get group that does not exist by objectID', async () => {
    //     const res = await chai.request(app)
    //         .get(`/api/test_group/groupId/999`);

    //     res.should.have.status(404);
    //     // res.body.should.be.a('object');
    // });

    it('should delete group', async () => {
        const res = await chai.request(app)
            .delete(`/api/test_group/${createdGroupId}/delete`);

        res.should.have.status(200);
        res.body.message.should.equal('Group deleted successfully');
    });

    it('should not delete a group that does not exist...', async () => {
        const res = await chai.request(app)
            .delete(`/api/test_group/${createdGroupId}/delete`);

        res.should.have.status(404);
        res.body.message.should.equal('Group not found');
    });


    it('should check if a group name exists', async () => {
        const res = await chai.request(app)
            .get(`/api/test_group/exists/Group2`);

        res.should.have.status(200);
        // expect(res.body).to.be.a('boolean');
    });

})

