import "mocha"
import mongoose, { Mongoose } from 'mongoose';
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/server";
import { server } from "../src/server";
import sinon from 'sinon';

import { TestUserModel } from "../src/test_routers/testUser.model";

const fs = require('fs');

chai.use(chaiHttp);
chai.should();
const expect = chai.expect;

//DELETE THE CONTENTS OF THE DATABASE BEFORE THE TEST (Remember, we are using a test DB, so this is OK) 
before(async () => {
    await TestUserModel.deleteMany({});
});

after(async () => {
    // await TicketModel.deleteMany({});
    await mongoose.connection.close();
    server.close();
});



describe('/User test collection', () => {
    it('should verify that we have no users in the DB...', async () => {
        const res = await chai.request(app)
            .get('/api/test_user');
        
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.should.have.lengthOf(0);
    });

    it('should post admin data...', async () => {
        const res = await chai.request(app)
            .get('/api/test_user/seed');
        
        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        res.body.message.should.be.a('string');
        expect(res.body.message).to.be.equal('Seed is done!');
    });

    it('should not reseed admin data...', async () => {
        const res = await chai.request(app)
            .get('/api/test_user/seed');
        
        res.should.have.status(401);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        res.body.message.should.be.a('string');
        expect(res.body.message).to.be.equal('Seed is already done');
    });

    let johnsInviteToken = '';
    let johnsObjectId : any;

    it('should create a user...', async () => {
        const toSend = {
            email: "Johndoe@gmail.com",
            manager: true,
            name: 'John',
            surname: "Doe",
            groups: [],
        }

        const res = await chai.request(app)
            .post('/api/test_user/create_user')
            .send(toSend);
        
        res.should.have.status(201);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        res.body.message.should.be.a('string');
        expect(res.body.message).to.be.equal('User created successfully');
        expect(res.body).to.have.property('inviteToken');
        res.body.inviteToken.should.be.a('string');

        johnsInviteToken = res.body.inviteToken;
        johnsObjectId = res.body.user._id;
    });

    it('should not create a user with a duplicate email...', async () => {
        const toSend = {
            email: "Johndoe@gmail.com",
            manager: true,
            name: 'John',
            surname: "Doe",
            groups: [],
        }

        const res = await chai.request(app)
            .post('/api/test_user/create_user')
            .send(toSend);
        
        res.should.have.status(409);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        res.body.message.should.be.a('string');
        expect(res.body.message).to.be.equal('User with this email already exists.');
    });

    it('should activate new users account...', async () => {
        const res = await chai.request(app)
            .get('/api/test_user/activate_account')
            .query({token: johnsInviteToken});
        
        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        res.body.message.should.be.a('string');
        expect(res.body.message).to.be.equal('valid token');
    });

    it('should not activate new users account with invalid token...', async () => {
        const res = await chai.request(app)
            .get('/api/test_user/activate_account')
            .query({token: 'jjjjj'});
        
        res.should.have.status(409);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        res.body.message.should.be.a('string');
        expect(res.body.message).to.be.equal('Invalid token.');
    });

    it('should activate the users account with their new password...', async () => {
        const toSend = {
            inviteToken: johnsInviteToken,
            password: 'NewPassword'
        }

        const res = await chai.request(app)
            .post('/api/test_user/activate_account')
            .send(toSend);
        
        res.should.have.status(201);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        res.body.message.should.be.a('string');
        expect(res.body.message).to.be.equal('Account activated successfully');
    });

    it('should not activate the users account with their new password if valid invite token...', async () => {
        const toSend = {
            inviteToken: johnsInviteToken,
            password: 'NewPassword'
        }

        const res = await chai.request(app)
            .post('/api/test_user/activate_account')
            .send(toSend);
        
        res.should.have.status(409);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        res.body.message.should.be.a('string');
        expect(res.body.message).to.be.equal('Invalid token.');
    });

    it('should login new activated user...', async () => {
        const toSend = {
            emailAddress: 'Johndoe@gmail.com',
            password: 'NewPassword'
        }

        const res = await chai.request(app)
            .post('/api/test_user/login')
            .send(toSend);
        
        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('auth');
        res.body.auth.should.be.a('boolean');
        expect(res.body.auth).to.be.equal(true);
    });

    it('should not login user with invalid password...', async () => {
        const toSend = {
            emailAddress: 'Johndoe@gmail.com',
            password: 'invalidPassword'
        }

        const res = await chai.request(app)
            .post('/api/test_user/login')
            .send(toSend);
        
        res.should.have.status(401);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('auth');
        res.body.auth.should.be.a('boolean');
        expect(res.body.auth).to.be.equal(false);
    });


    it('should not login user with invalid email...', async () => {
        const toSend = {
            emailAddress: 'invalidEmail@example.com',
            password: 'NewPassword'
        }

        const res = await chai.request(app)
            .post('/api/test_user/login')
            .send(toSend);
        
        res.should.have.status(404);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        res.body.message.should.be.a('string');
        expect(res.body.message).to.be.equal('No user found.');
    });

    let sarahsInviteToken = '';
    let sarahsObjectId : any;

    it('should create a user sarah...', async () => {
        const toSend = {
            email: "sarahconner@gmail.com",
            manager: true,
            name: 'John',
            surname: "Doe",
            groups: [],
        }

        const res = await chai.request(app)
            .post('/api/test_user/create_user')
            .send(toSend);
        
        res.should.have.status(201);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        res.body.message.should.be.a('string');
        expect(res.body.message).to.be.equal('User created successfully');
        expect(res.body).to.have.property('inviteToken');
        res.body.inviteToken.should.be.a('string');

        sarahsInviteToken = res.body.inviteToken;
        sarahsObjectId = res.body.user._id;
    });

    it('should get user by their token...', async () => {
        const toSend = {
            token: sarahsInviteToken,
        }

        const res = await chai.request(app)
            .post('/api/test_user/get_user_by_token')
            .send(toSend);
        
        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('email');
        res.body.email.should.be.a('string');
        expect(res.body.email).to.be.equal('sarahconner@gmail.com');
    });

    it('should not get user by an invalid token...', async () => {
        const toSend = {
            token: 'hahahaha',
        }

        const res = await chai.request(app)
            .post('/api/test_user/get_user_by_token')
            .send(toSend);
        
        res.should.have.status(404);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('error');
        res.body.error.should.be.a('string');
        expect(res.body.error).to.be.equal('User not found');
    });

    it('should update a user name...', async () => {
        const toSend = {
            name: 'Sam',
            email: 'sarahconner@gmail.com'
        }

        const res = await chai.request(app)
            .put('/api/test_user/update_user_name')
            .send(toSend);
        
        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        res.body.message.should.be.a('string');
        expect(res.body.message).to.be.equal('User name updated successfuly');
    });

    it('should not update a user name for invalid email...', async () => {
        const toSend = {
            name: 'Sam',
            email: 'invalidemail@example.com'
        }

        const res = await chai.request(app)
            .put('/api/test_user/update_user_name')
            .send(toSend);
        
        res.should.have.status(404);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        res.body.message.should.be.a('string');
        expect(res.body.message).to.be.equal('User not found');
    });

    it('should update a users password...', async () => {
        const toSend = {
            password: 'NewNewPassword',
            email: 'sarahconner@gmail.com'
        }

        const res = await chai.request(app)
            .put('/api/test_user/update_user_password')
            .send(toSend);
        
        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        res.body.message.should.be.a('string');
        expect(res.body.message).to.be.equal('User password updated successfuly');
    });


    it('should not update a users password for an invalid email...', async () => {
        const toSend = {
            password: 'NewNewPassword',
            email: 'invalidemail@example.com'
        }

        const res = await chai.request(app)
            .put('/api/test_user/update_user_password')
            .send(toSend);
        
        res.should.have.status(404);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        res.body.message.should.be.a('string');
        expect(res.body.message).to.be.equal('User not found');
    });

    it('should update a users location...', async () => {
        const toSend = {
            location: 'Johannesburg',
            email: 'sarahconner@gmail.com'
        }

        const res = await chai.request(app)
            .put('/api/test_user/update_user_location')
            .send(toSend);
        
        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        res.body.message.should.be.a('string');
        expect(res.body.message).to.be.equal('User location updated successfully');
    });

    it('should not update a users location for an invalid email...', async () => {
        const toSend = {
            location: 'Johannesburg',
            email: 'invalidemail@example.com'
        }

        const res = await chai.request(app)
            .put('/api/test_user/update_user_location')
            .send(toSend);
        
        res.should.have.status(404);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        res.body.message.should.be.a('string');
        expect(res.body.message).to.be.equal('User not found');
    });

    it('should update a users github...', async () => {
        const toSend = {
            github: 'https://github.com',
            email: 'sarahconner@gmail.com'
        }

        const res = await chai.request(app)
            .put('/api/test_user/update_user_github')
            .send(toSend);
        
        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        res.body.message.should.be.a('string');
        expect(res.body.message).to.be.equal('User Github updated successfully');
    });

    it('should not update a users github for an invalid email...', async () => {
        const toSend = {
            github: 'https://github.com',
            email: 'invalidemail@example.com'
        }

        const res = await chai.request(app)
            .put('/api/test_user/update_user_github')
            .send(toSend);
        
        res.should.have.status(404);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        res.body.message.should.be.a('string');
        expect(res.body.message).to.be.equal('User not found');
    });

    it('should update a users linkedIn...', async () => {
        const toSend = {
            linkedin: 'https://linkedIn.com',
            email: 'sarahconner@gmail.com'
        }

        const res = await chai.request(app)
            .put('/api/test_user/update_user_linkedin')
            .send(toSend);
        
        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        res.body.message.should.be.a('string');
        expect(res.body.message).to.be.equal('User Linkedin updated successfully');
    });

    it('should not update a users linkedIn for an invalid email...', async () => {
        const toSend = {
            linkedin: 'https://linkedIn.com',
            email: 'invalidemail@example.com'
        }

        const res = await chai.request(app)
            .put('/api/test_user/update_user_linkedin')
            .send(toSend);
        
        res.should.have.status(404);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        res.body.message.should.be.a('string');
        expect(res.body.message).to.be.equal('User not found');
    });

    it('should GET a user by their ID...', async () => {
        const res = await chai.request(app)
            .get('/api/test_user/id')
            .query({id: 2});
        
        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('emailAddress');
        res.body.emailAddress.should.be.a('string');
        expect(res.body.emailAddress).to.be.equal('Johndoe@gmail.com');
    });

    it('should not GET a user by an invalid ID...', async () => {
        const res = await chai.request(app)
            .get('/api/test_user/id')
            .query({id: 5});
        
        res.should.have.status(404);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        res.body.message.should.be.a('string');
        expect(res.body.message).to.be.equal('Id not found');
    });

    it('should GET a user by their email...', async () => {
        const res = await chai.request(app)
            .get('/api/test_user/email')
            .query({email: 'sarahconner@gmail.com'});
        
        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('name');
        res.body.name.should.be.a('string');
        expect(res.body.name).to.be.equal('Sam');
    });

    it('should not GET a user by an invalid email...', async () => {
        const res = await chai.request(app)
            .get('/api/test_user/email')
            .query({email: 'invalidemail.example.com'});
        
        res.should.have.status(404);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        res.body.message.should.be.a('string');
        expect(res.body.message).to.be.equal('Id not found');
    });

    it('should add group to user if user exists', async () => {
        const toSend = {
            groupId: '1'
        }
    
        const res = await chai.request(app)
            .post(`/api/test_user/${sarahsObjectId}/add-group`)
            .send(toSend);
    
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('groups');
        res.body.groups.should.be.a('array');
        res.body.groups.should.have.lengthOf(1);
        res.body.groups[0].should.be.a('string');
        expect(res.body.groups[0]).to.be.equal('1');
    });

    it('should not add group to user if user id is invalid', async () => {
        const toSend = {
            groupId: '1'
        }

        let invalidObjectId = new mongoose.Types.ObjectId(1);
        
        const res = await chai.request(app)
            .post(`/api/test_user/${invalidObjectId}/add-group`)
            .send(toSend);
    
        expect(res).to.have.status(404);
    });

    it('should add group to users with Object Ids', async () => {
        const toSend = {
            groupId: '1',
            userIds: [sarahsObjectId, johnsObjectId]
        }
    
        const res = await chai.request(app)
            .post(`/api/test_user/add-group-to-users`)
            .send(toSend);
    
        expect(res).to.have.status(201);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('modifiedCount');
        expect(res.body.modifiedCount).to.be.equal(2);
    });

    it('should remove a group from users groups', async () => {
        let userId = sarahsObjectId;
        let groupId = '1';
    
        const res = await chai.request(app)
            .delete(`/api/test_user/${userId}/group/${groupId}`);
    
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.equal("Group removed from user's groups");
    });

    it('should update a users profile picture', async () => {
        const toSend = {
            userId: '2',
            url: './src/test_routers/test.png'
        }
    
        const res = await chai.request(app)
            .put(`/api/test_user/updateProfilePicture`)
            .send(toSend);
    
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.equal('Profile picture updated successfully.');
    });

    it('should not update a users profile picture if invalid user id', async () => {
        const toSend = {
            userId: '5',
            url: './src/test_routers/test.png'
        }
    
        const res = await chai.request(app)
            .put(`/api/test_user/updateProfilePicture`)
            .send(toSend);
    
        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.equal('No user found with the provided ID or no update was needed.');
    });

    it('should update a users profile header', async () => {
        const toSend = {
            userId: '2',
            url: './src/test_routers/test.png'
        }
    
        const res = await chai.request(app)
            .put(`/api/test_user/updateProfileHeader`)
            .send(toSend);
    
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.equal('Profile header updated successfully.');
    });

    it('should not update a users profile header if invalid user id', async () => {
        const toSend = {
            userId: '5',
            url: './src/test_routers/test.png'
        }
    
        const res = await chai.request(app)
            .put(`/api/test_user/updateProfileHeader`)
            .send(toSend);
    
        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.equal('No user found with the provided ID or no update was needed.');
    });

    it('should update a users bio', async () => {
        const toSend = {
            userId: '2',
            bio: 'sarahs bio'
        }
    
        const res = await chai.request(app)
            .put(`/api/test_user/updateBio`)
            .send(toSend);
    
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.equal('Bio updated successfully.');
    });

    it('should not update a users bio if invalid user id', async () => {
        const toSend = {
            userId: '5',
            bio: 'no bio'
        }
    
        const res = await chai.request(app)
            .put(`/api/test_user/updateBio`)
            .send(toSend);
    
        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.equal('No user found with the provided ID or no update was needed.');
    });

    it('should update a users github', async () => {
        const toSend = {
            userId: '2',
            githubLink: 'https://github.com'
        }
    
        const res = await chai.request(app)
            .put(`/api/test_user/updateGithub`)
            .send(toSend);
    
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.equal('Github link updated successfully.');
    });

    it('should not update a users github if invalid user id', async () => {
        const toSend = {
            userId: '5',
            githubLink: 'https://github.com'
        }
    
        const res = await chai.request(app)
            .put(`/api/test_user/updateGithub`)
            .send(toSend);
    
        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.equal('No user found with the provided ID or no update was needed.');
    });

    it('should update a users linkedin', async () => {
        const toSend = {
            userId: '2',
            linkedinLink: 'https://linkedin.com'
        }
    
        const res = await chai.request(app)
            .put(`/api/test_user/updateLinkedin`)
            .send(toSend);
    
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.equal('LinkedIn link updated successfully.');
    });

    it('should not update a users linkedin if invalid user id', async () => {
        const toSend = {
            userId: '5',
            linkedinLink: 'https://linkedin.com'
        }
    
        const res = await chai.request(app)
            .put(`/api/test_user/updateLinkedin`)
            .send(toSend);
    
        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.equal('No user found with the provided ID or no update was needed.');
    });

    it('should not remove a group from users groups with invalid groupId', async () => {
        let userId = sarahsObjectId;
        let groupId = '5';
    
        const res = await chai.request(app)
            .delete(`/api/test_user/${userId}/group/${groupId}`);
    
        expect(res).to.have.status(404);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.equal("Group not found in user's groups");
    });

    it('should not remove a group from an invalid user id', async () => {
        let userId = new mongoose.Types.ObjectId(100);
        let groupId = '1';
    
        const res = await chai.request(app)
            .delete(`/api/test_user/${userId}/group/${groupId}`);
    
        expect(res).to.have.status(404);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.equal("User not found");
    });

    it('should GET a user by their encoded email...', async () => {
        let userEmail = 'sarahconner@gmail.com';

        const res = await chai.request(app)
            .get(`/api/test_user/email/${userEmail}`);
        
        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('name');
        res.body.name.should.be.a('string');
        expect(res.body.name).to.be.equal('Sam');
    });

    it('should not GET a user by an invalid encoded email...', async () => {
        let userEmail = 'invalidemail@example.com';

        const res = await chai.request(app)
            .get(`/api/test_user/email/${userEmail}`);
        
        res.should.have.status(404);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        res.body.message.should.be.a('string');
        expect(res.body.message).to.be.equal('User not found');
    });

    it('should GET a user by their encoded object id...', async () => {
        let id = sarahsObjectId;

        const res = await chai.request(app)
            .get(`/api/test_user/${id}`);
        
        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('emailAddress');
        res.body.emailAddress.should.be.a('string');
        expect(res.body.emailAddress).to.be.equal('sarahconner@gmail.com');
    });

    it('should not GET a user by an encoded object id...', async () => {
        let id = new mongoose.Types.ObjectId(1);

        const res = await chai.request(app)
            .get(`/api/test_user/${id}`);
        
        res.should.have.status(404);
        res.body.should.be.a('object');
    });

    it('should update a users background photo...', async () => {
        let email = 'sarahconner@gmail.com'

        const res = await chai.request(app)
            .put('/api/test_user/update_background_picture')
            .field('email', email)
            .attach('file', fs.readFileSync('./src/test_routers/test.png'), 'test.png');
        
        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        res.body.message.should.be.a('string');
        expect(res.body.message).to.be.equal('User background photo updated successfuly');
    });

    it('should not update a users background photo if no image has been uploaded...', async () => {
        let email = 'sarahconner@gmail.com'

        const res = await chai.request(app)
            .put('/api/test_user/update_background_picture')
            .field('email', email);
        
        res.should.have.status(400);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        res.body.message.should.be.a('string');
        expect(res.body.message).to.be.equal('No file uploaded');
    });

    it('should not update a users background photo if email is invalid...', async () => {
        let email = 'invalidemail@example.com'

        const res = await chai.request(app)
            .put('/api/test_user/update_background_picture')
            .field('email', email)
            .attach('file', fs.readFileSync('./src/test_routers/test.png'), 'test.png');
        
        res.should.have.status(404);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        res.body.message.should.be.a('string');
        expect(res.body.message).to.be.equal('User not found');
    });

    it('should update a users bio...', async () => {
        const toSend = {
            bio: 'New bio',
            email: 'sarahconner@gmail.com'
        }

        const res = await chai.request(app)
            .put('/api/test_user/update_user_bio')
            .send(toSend);
        
        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        res.body.message.should.be.a('string');
        expect(res.body.message).to.be.equal('User bio updated successfuly');
    });

    it('should not update a users bio for an invalid email...', async () => {
        const toSend = {
            bio: 'New bio',
            email: 'invalidemail@example.com'
        }

        const res = await chai.request(app)
            .put('/api/test_user/update_user_bio')
            .send(toSend);
        
        res.should.have.status(404);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        res.body.message.should.be.a('string');
        expect(res.body.message).to.be.equal('User not found');
    });

    it('should add a group to a user...', async () => {
      const toSend = {
          userId: sarahsObjectId,
          groupId: '5', // use an actual groupId that exists in the database
      }
  
      const res = await chai.request(app)
          .post('/api/test_user/addGroup')
          .send(toSend);
      
      res.should.have.status(201);
      res.body.should.be.a('object');
      expect(res.body).to.have.property('groups');
      res.body.groups.should.be.a('array');
      expect(res.body.groups).to.include('5');
  });


  it('should get user by id...', async () => {
    const res = await chai.request(app)
        .get('/api/test_user/' + johnsObjectId);
    
    res.should.have.status(200);
    res.body.should.be.a('object');
    expect(res.body._id).to.be.equal(johnsObjectId);
    expect(res.body.emailAddress).to.be.equal('Johndoe@gmail.com');
    expect(res.body.name).to.be.equal('John');
    expect(res.body.surname).to.be.equal('Doe');
    expect(res.body.groups).to.be.an('array').that.includes('1');

  });
  // it('should return 404 when user does not exist', async () => {
  //   const nonExistingId = '6078fd71cd9e35a06b1b7f7b';

  //   const res = await chai.request(app)
  //       .get('/api/test_user/' + nonExistingId);
    
  //   res.should.have.status(404);
  //   res.body.should.be.a('object');
  //   res.body.should.have.property('message');
  //   res.body.message.should.be.equal('User not found');
  // });



    it('should delete the database...', async() => {
        const res = await chai.request(app)
            .get('/api/test_user/delete');
        
        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        res.body.message.should.be.a('string');
        expect(res.body.message).to.be.equal('Delete is done!');
    });
});
