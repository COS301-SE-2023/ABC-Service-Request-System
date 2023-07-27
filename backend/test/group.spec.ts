import "mocha"
import mongoose from 'mongoose';
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/server";
import { server } from "../src/server";
import { testGroupModel, group } from "../src/test_routers/testGroup.model";


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
});

describe ('/First test collection',() => {
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

    it('should POST sample_groups data...', async () => {
        // const res2 = await chai.request(app).get('/api/test_user/seed');
        const res = await chai.request(app)
            .get('/api/test_group/seed');
        
        res.should.have.status(201);
        res.body.should.be.a('array');
        res.body.should.have.lengthOf(3);

    });

    it('should return all groups in the database...', async() => {
        const res = await chai.request(app).get('/api/test_group');
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.should.have.lengthOf(3);
    })

    it('should fail when no file is attached', async () => {
        const res = await chai.request(app)
            .post('/api/test_group/upload');

        res.should.have.status(400);
        res.body.should.be.a('object');
        expect(res.body.message).to.be.equal('No file uploaded');
    });
})

describe('/Group ID routes',() => {
    it('should return all users in a group...', async() => {
        const res = await chai.request(app).get('/api/test_group/1/users');
        res.should.have.status(200);
        res.body.should.be.a('array');
    })

    it ('should not return users from a group that does not exist...', async() => {
        const res = await chai.request(app).get('/api/test_group/9999/users');
        res.should.have.status(404);
        expect(res.body.message).to.be.equal('Group not found');
    })

    it ('should return a user from a group...', async() => {
        const res = await chai.request(app).get('/api/test_group/1/user/64afe5267620bef794d12bc0');
        res.should.have.status(200);
        // res.should.be.a('array');
    })

    // it ('should NOT return a user that does not exist from a group...', async() => {
    //     const res = await chai.request(app).get('/api/test_group/1/user/64afe5267620bef794d12bc1');
    //     res.should.have.status(500);
    //     expect(res.body.message).to.be.equal('User not found');
    // })

    it ('should NOT return a user from a group that does not exist...', async() => {
        const res = await chai.request(app).get('/api/test_group/999/user/1');
        res.should.have.status(404);
        expect(res.body.message).to.be.equal('Group not found');
    })

    it ('should return the name of a group...', async() => {
        const res = await chai.request(app).get('/api/test_group/1/name');
        res.should.have.status(200);
        // res.body.should.be.a('json');
    })

    it ('should not return the name of a group that does not exist...', async() => {
        const res = await chai.request(app).get('/api/test_group/999/name');
        res.should.have.status(404);
        expect(res.body.message).to.be.equal('Group not found');
    })

    it ('should return a group given its group ID...', async() => {
        const res = await chai.request(app).get('/api/test_group/1');
        res.should.have.status(200);
    })

    it ('should not return a group that does not exist given its group ID...', async() => {
        const res = await chai.request(app).get('/api/test_group/999');
        res.should.have.status(404);
        expect(res.body.message).to.be.equal('Group not found');
    })

})

describe('/Delete groupDB routes',() => {
    it('should not delete a user from a group that does not exist...',async() => {
        const res = await chai.request(app).delete('/api/test_group/999/user/john.doe@example.com');
        res.should.have.status(404);
        expect(res.body.message).to.be.equal('Group not found');
    })

    it('should not delete a user that does not exist from a group...',async() => {
        const res = await chai.request(app).delete('/api/test_group/1/user/john.doe@example.com');
        res.should.have.status(404);
        expect(res.body.message).to.be.equal('User not found');
    })

    it ('should not delete a group that does not exist...', async() => {
        const res = await chai.request(app).delete('/api/test_group/999/delete');
        res.should.have.status(404);
        expect(res.body.message).to.be.equal('Group not found');
    })

    it ('should delete a group...', async() => {
        const res = await chai.request(app).delete('/api/test_group/3/delete');
        res.should.have.status(200);
        expect(res.body.message).to.be.equal('Group deleted successfully');
    })
})

describe ('/PUT routes for GroupDB', () => {

    // it('should add people to a group...', async() => {
    //     // Replace this with a real list of people objects or ids.
    //     const peopleToAdd = ['64a975a92dccda602dd87645', '64a975c12dccda602dd8764d']; 
    //     const res = await chai.request(app)
    //         .put('/api/add-people')
    //         .send({
    //             group: '64afedeacdb2dcb55c02600c',
    //             people: peopleToAdd,
    //         });
        
    //     res.should.have.status(200);
    //     expect(res.body.message).to.be.equal('users added to group');

    //     // const groupRes = await chai.request(app).get(`/api/test_group/1`);
    //     // groupRes.body.people.should.include.members(peopleToAdd);
    // });

    it('should fail when group is not found...', async() => {
        const fakeGroupId = '64afedeacdb2dcb55c02600c';
        const res = await chai.request(app)
            .put('/api/add-people')
            .send({
                group: fakeGroupId,
                people: ['64a975a92dccda602dd87645', '64a975c12dccda602dd8764d']
            });

        res.should.have.status(404);
        // expect(res.body.message).to.be.equal('Group not found');
    });

    // it('should handle internal server error...', async() => {
    //     const badReq = await chai.request(app)
    //         .put('/api/add-people')
    //         .send({}); 

    //     badReq.should.have.status(500);
    //     expect(badReq.body.error).to.be.equal('Internal server error');
    // });
})