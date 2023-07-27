// import "mocha"
// import chai from 'chai';
// import chaiHttp from 'chai-http';
// import app from "../src/server";  // Import your Express app
// import { TestUserModel } from "../src/test_routers/testUser.model"; // Import your User model
// import { server } from "../src/server";
// import mongoose from 'mongoose';

// const jwt = require('jsonwebtoken');
// import dotenv from "dotenv";
// dotenv.config();

// const { expect } = chai;
// chai.use(chaiHttp);

// before(async () => {
//   await TestUserModel.deleteMany({}); 
  
// });

// after(async () => {
//   await mongoose.connection.close();
//   server.close();
// });

// describe('/User test collection', () => {

//   let token = '';
//   let inviteToken = '';
//   let userId = '';
//   let userEmail = '';
//   let userName = '';
//   let userLocation = '';
//   let userGithub = '';
//   let userLinkedin = '';

//   it('should verify that we have no users in the DB...', async () => {
//     const res = await chai.request(app)
//         .get('/api/test_user');
    
//     res.should.have.status(200);
//     res.body.should.be.a('array');
//     res.body.should.have.lengthOf(0);
//   });

//   it('should seed the database...', async () => {
//     const res = await chai.request(app)
//         .get('/api/test_user/seed');
    
//     res.should.have.status(200);
//     res.body.should.be.a('object');
//     res.body.should.have.property('message').eql('Seed is done!');
//   });

//   it('should return all users...', async () => {
//     const res = await chai.request(app)
//         .get('/api/test_user');
    
//     res.should.have.status(200);
//     res.body.should.be.a('array');
//   });

//   it('should delete all users...', async () => {
//     const res = await chai.request(app)
//         .get('/api/test_user/delete');
    
//     res.should.have.status(200);
//     res.text.should.be.eql('Delete is done!');
//   });

//   it('should create a new user', async () => {
//     const testUser = {
//       name: 'John',
//       surname: 'Doe',
//       email: 'john@example.com',
//       manager: true,
//       selectedGroups: ['group1', 'group2']
//     };

//     const res = await chai.request(app)
//       .post('/api/test_user/create_user')
//       .send(testUser);

//     expect(res).to.have.status(201);
//     expect(res.body).to.be.a('object');
//     expect(res.body).to.have.property('message').eql('User created successfully');
//     expect(res.body).to.have.property('inviteToken');
//     expect(res.body).to.have.property('user');

//     inviteToken = res.body.inviteToken; 
//     userEmail = testUser.email; 
//     userId = res.body.user.id;
//   });

//   it('should not create a user with the email that already exists', async () => {
//     const testUser = {
//       name: 'John',
//       surname: 'Doe',
//       email: 'john@example.com',
//       manager: true,
//       selectedGroups: ['group1', 'group2']
//     };

//     // create a user
//     await chai.request(app)
//       .post('/api/test_user/create_user')
//       .send(testUser);

//     // try to create a user with the same email
//     const res = await chai.request(app)
//       .post('/api/test_user/create_user')
//       .send(testUser);

//     expect(res).to.have.status(409);
//     expect(res.text).to.eql('User with this email already exists.');
//   });

//   it('should return a redirect for valid invite token', async () => {
//     const res = await chai.request(app)
//       .get(`/api/test_user/activate_account?token=${inviteToken}`);

//     expect(res).to.redirect;
//   });

//   it('should not return a redirect for invalid invite token', async () => {
//     const res = await chai.request(app)
//       .get('/api/test_user/activate_account?token=invalidToken');

//     expect(res).to.have.status(409);
//     expect(res.text).to.eql('Invalid token.');
//   });

//   it('should activate a user with valid invite token', async () => {
//     const res = await chai.request(app)
//       .post('/api/test_user/activate_account')
//       .send({ inviteToken, password: 'newPassword' });

//     expect(res).to.have.status(201);
//     expect(res.body).to.be.a('object');
//     expect(res.body).to.have.property('message').eql('Account activated successfully');
//   });

//   it('should not activate a user with invalid invite token', async () => {
//     const res = await chai.request(app)
//       .post('/api/test_user/activate_account')
//       .send({ inviteToken: 'invalidToken', password: 'newPassword' });

//     expect(res).to.have.status(409);
//     expect(res.text).to.eql('Invalid token.');
//   });

//   it('should get a user by invite token', async () => {
//     const res = await chai.request(app)
//       .post('/api/test_user/get_user_by_token')
//       .send({ inviteToken: inviteToken });

//     expect(res).to.have.status(200);
//     expect(res.body).to.be.a('object');
//     expect(res.body).to.have.property('email').eql('john@example.com');
//   });

//   it('should not get a user by invalid invite token', async () => {
//     const res = await chai.request(app)
//       .post('/api/test_user/get_user_by_token')
//       .send({ token: 'invalidtoken' });

//     expect(res).to.have.status(404);
//     expect(res.body).to.be.a('object');
//     expect(res.body).to.have.property('error').eql('User not found');
//   });

//   it('should update a user name', async () => {
//     const newName = 'Jane';
//     const res = await chai.request(app)
//       .put('/api/test_user/update_user_name')
//       .send({ email: userEmail, name: newName });

//     expect(res).to.have.status(200);
//     expect(res.body).to.be.a('object');
//     expect(res.body).to.have.property('message').eql('User name updated successfuly');

//     // Save the new name for future use
//     userName = newName;
//   });

//   it('should not update a user name if user not found', async () => {
//     const newName = 'Jane';
//     const res = await chai.request(app)
//       .put('/api/test_user/update_user_name')
//       .send({ email: 'nonexistent@example.com', name: newName });

//     expect(res).to.have.status(404);
//     expect(res.body).to.be.a('object');
//     expect(res.body).to.have.property('message').eql('User not found');
//   });

//   it('should update a user location', async () => {
//     const newLocation = 'London';
//     const res = await chai.request(app)
//       .put('/api/test_user/update_user_location')
//       .send({ email: userEmail, location: newLocation });
  
//     expect(res).to.have.status(200);
//     expect(res.body).to.be.a('object');
//     expect(res.body).to.have.property('message').eql('User location updated successfully');
  
//     // Save the new location for future use
//     userLocation = newLocation;
//   });
  
//   it('should not update a user location if user does not exist', async () => {
//     const newLocation = 'London';
//     const res = await chai.request(app)
//       .put('/api/test_user/update_user_location')
//       .send({ email: 'nonexistentuser@example.com', location: newLocation });  // nonexistent email
  
//     expect(res).to.have.status(404);
//     expect(res.body).to.be.a('object');
//     expect(res.body).to.have.property('message').eql('User not found');
//   });

//   it('should update a user Github', async () => {
//     const newGithub = 'newGithubName';
//     const res = await chai.request(app)
//       .put('/api/test_user/update_user_github')
//       .send({ email: userEmail, github: newGithub });

//     expect(res).to.have.status(200);
//     expect(res.body).to.be.a('object');
//     expect(res.body).to.have.property('message').eql('User Github updated successfully');

//     // Save the new Github for future use
//     userGithub = newGithub;
//   });

//   it('should not update a user Github if user does not exist', async () => {
//     const newGithub = 'newGithubName';
//     const res = await chai.request(app)
//       .put('/api/test_user/update_user_github')
//       .send({ email: 'nonexistentuser@example.com', github: newGithub });

//     expect(res).to.have.status(404);
//     expect(res.body).to.be.a('object');
//     expect(res.body).to.have.property('message').eql('User not found');
//   });

//   it('should update a user Linkedin', async () => {
//     const newLinkedin = 'newLinkedinProfile';
//     const res = await chai.request(app)
//       .put('/api/test_user/update_user_linkedin')
//       .send({ email: userEmail, linkedin: newLinkedin });

//     expect(res).to.have.status(200);
//     expect(res.body).to.be.a('object');
//     expect(res.body).to.have.property('message').eql('User Linkedin updated successfully');

//     // Save the new Linkedin for future use
//     userLinkedin = newLinkedin;
//   });

//   it('should not update Linkedin for non-existent user', async () => {
//     const newLinkedin = 'newLinkedinProfile';
//     const res = await chai.request(app)
//       .put('/api/test_user/update_user_linkedin')
//       .send({ email: 'nonexistent@example.com', linkedin: newLinkedin });

//     expect(res).to.have.status(404);
//     expect(res.body).to.be.a('object');
//     expect(res.body).to.have.property('message').eql('User not found');
//   });

//   it('should return a user by email', async () => {
//     const res = await chai.request(app)
//       .get('/api/test_user/email')
//       .query({ email: userEmail });

//     expect(res).to.have.status(200);
//     expect(res.body).to.be.a('object');
//     expect(res.body).to.have.property('emailAddress').eql(userEmail);
//   });

//   it('should not return a user if email is not found', async () => {
//     const res = await chai.request(app)
//       .get('/api/test_user/email')
//       .query({ email: 'nonexistent@example.com' });

//     expect(res).to.have.status(404);
//     expect(res.text).to.eql('Id not found');
//   });

//   it('should not update a bio for non-existent user', async () => {
//     const newBio = 'This is a new bio';
//     const res = await chai.request(app)
//       .put('/updateBio')
//       .send({ userId: 'non-existent-user-id', bio: newBio });

//     expect(res).to.have.status(404);
//   });

//   // it('should update a user Github link', async () => {
//   //   const newGithubLink = 'https://github.com/new-link';
//   //   const res = await chai.request(app)
//   //     .put('/updateGithub')
//   //     .send({ userId: userId, githubLink: newGithubLink });

//   //   expect(res).to.have.status(200);
//   //   expect(res.body).to.be.a('object');
//   //   expect(res.body).to.have.property('message').eql('Github link updated successfully.');
//   // });

//   it('should not update a Github link for non-existent user', async () => {
//       const newGithubLink = 'https://github.com/new-link';
//       const res = await chai.request(app)
//         .put('/updateGithub')
//         .send({ userId: 'non-existent-user-id', githubLink: newGithubLink });

//       expect(res).to.have.status(404);
//   });

//   // it('should update a user LinkedIn link', async () => {
//   //   const newLinkedinLink = 'https://linkedin.com/in/new-link';
//   //   const res = await chai.request(app)
//   //     .put('/updateLinkedin')
//   //     .send({ userId: userId, linkedinLink: newLinkedinLink });

//   //   expect(res).to.have.status(200);
//   //   expect(res.body).to.be.a('object');
//   //   expect(res.body).to.have.property('message').eql('LinkedIn link updated successfully.');
//   // });

//   it('should not update a LinkedIn link for non-existent user', async () => {
//       const newLinkedinLink = 'https://linkedin.com/in/new-link';
//       const res = await chai.request(app)
//         .put('/updateLinkedin')
//         .send({ userId: 'non-existent-user-id', linkedinLink: newLinkedinLink });

//       expect(res).to.have.status(404);
//   });


  
// });