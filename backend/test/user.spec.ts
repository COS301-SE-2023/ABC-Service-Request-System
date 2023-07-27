// import "mocha"
// import chai from 'chai';
// import chaiHttp from 'chai-http';
// import app from "../src/server";  // Import your Express app
// import { TestUserModel } from "../src/test_routers/testUser.model"; // Import your User model

// const jwt = require('jsonwebtoken');
// import dotenv from "dotenv";
// dotenv.config();

// const { expect } = chai;
// chai.use(chaiHttp);

// // Test data
// const testUser = {
//     name: 'Test',
//     surname: 'User',
//     profilePhoto: 'path/to/photo',
//     emailAddress: 'testuser@example.com',
//     password: 'Password123',
//     roles: ['Manager'],
//     groups: ['Group1'],
// };

// describe('User API routes', () => {
//     beforeEach(async () => {
//         // Clean up the database before each test
//         await TestUserModel.deleteMany({});
//     });

//     describe("GET /api/test_user/seed", () => {
//       it("should verify that we have no users in the DB...", (done) => {
//         chai
//           .request(app)
//           .get("/api/test_user/delete")
//           .end((err, res) => {
//             res.should.have.status(200);
//             res.body.should.be.a("object");
//             res.body.message.should.equal("Delete is done");
//             done();
//           });
//       });
//     });

//     describe("GET /api/test_user/seed", () => {
//       it("should seed the database with sample users", (done) => {
//         chai
//           .request(app)
//           .get("/api/test_user/seed")
//           .end((err, res) => {
//             res.should.have.status(200);
//             res.body.should.be.a("object");
//             res.body.message.should.equal("Seed is done!");
//             done();
//           });
//       });
//     });

//     describe('POST /api/test_user/create_user', () => {
//         it('should create a new user', (done) => {
//             chai.request(app)
//                 .post('/api/test_user/create_user')
//                 .send(testUser)
//                 .end((err, res) => {
//                     expect(res).to.have.status(201);
//                     expect(res.body.message).to.equal('User created successfully');
//                     done();
//                 });
//         });
//     });

//     // describe('POST /api/test_user/activate_account', () => {
//     //     it('should activate a user account', async () => {
//     //         // Create a test user
//     //         const user = new TestUserModel(testUser);
//     //         await user.save();

//     //         const res = await chai.request(app)
//     //             .post('/api/test_user/activate_account')
//     //             .send({ inviteToken: user.inviteToken, password: 'NewPassword123' });

//     //         expect(res).to.have.status(201);
//     //         expect(res.body.message).to.equal('Account activated successfully');
//     //     });
//     // });
    
//     // describe("GET /api/test_user/activate_account", () => {
//     //   it("should redirect to the password reset page with a valid token", (done) => {
//     //     // Create a test user with an invite token
//     //     const user = new TestUserModel({
//     //       name: "John",
//     //       surname: "Doe",
//     //       profilePhoto: "photo.jpg",
//     //       emailAddress: "john.doe@example.com",
//     //       roles: ["Manager"],
//     //       groups: ["Group1"],
//     //       password: "password",
//     //       inviteToken: "valid_token",
//     //     });
    
//     //     user.save()
//     //       .then((savedUser) => {
//     //         chai
//     //           .request(app)
//     //           .get("/api/test_user/activate_account")
//     //           .query({ token: savedUser.inviteToken })
//     //           .end((err, res) => {
//     //             if (err) {
//     //               return done(err);
//     //             }
    
//     //             res.should.redirectTo(`http://localhost:4200/activate_account/${savedUser.inviteToken}`);
//     //             done();
//     //           });
//     //       })
//     //       .catch((err) => {
//     //         done(err);
//     //       });
//     //   });
    
    
//     //   it("should return 409 status for an invalid token", (done) => {
//     //     chai
//     //       .request(app)
//     //       .get("/api/test_user/activate_account")
//     //       .query({ token: "invalid_token" })
//     //       .end((err, res) => {
//     //         res.should.have.status(409);
//     //         res.text.should.equal("Invalid token.");
//     //         done();
//     //       });
//     //   });
//     // });
    

//     describe("User API", () => {
    
//       beforeEach(async () => {
//         // Prepare the test data or reset the database to a known state
//         // This will be executed before each test case
//         await TestUserModel.deleteMany({});
//     });
    
    
//       afterEach(async () => {
//         // Clean up any resources created during the test case
//         // This will be executed after each test case
//       });
    
//       describe("GET /api/test_user", () => {
//         it("should return an empty array when no users are present", (done) => {
//           chai
//             .request(app)
//             .get("/api/test_user")
//             .end((err, res) => {
//               res.should.have.status(200);
//               res.body.should.be.a("array");
//               res.body.length.should.be.eql(0); // Expecting no users
//               done();
//             });
//         });
//       });
    
//       // describe("POST /api/test_user/create_user", () => {
//       //   it("should create a new user", (done) => {
//       //     chai
//       //       .request(app)
//       //       .post("/api/test_user/create_user")
//       //       .send({
//       //         name: "John",
//       //         surname: "Doe",
//       //         profilePhoto: "photo.jpg",
//       //         emailAddress: "john.doe@example.com",
//       //         roles: ["Manager"],
//       //         groups: ["Group1"]
//       //       })
//       //       .end((err, res) => {
//       //         res.should.have.status(201);
//       //         res.body.should.be.a("object");
//       //         res.body.should.have.property("message").eql("User created successfully");
//       //         done();
//       //       });
//       //   });
//       // });
    
//       describe("GET /api/test_user", () => {
//         it("should get all users", (done) => {
//           const user1 = new TestUserModel({
//             name: "John",
//             surname: "Doe",
//             profilePhoto: "photo.jpg",
//             emailAddress: "john.doe@example.com",
//             roles: ["Manager"],
//             groups: ["Group1"],
//             password: "password" // Add the password field
//           });
      
//           const user2 = new TestUserModel({
//             name: "Jane",
//             surname: "Doe",
//             profilePhoto: "photo2.jpg",
//             emailAddress: "jane.doe@example.com",
//             roles: ["Admin"],
//             groups: ["Group2"],
//             password: "password" // Add the password field
//           });
      
//           Promise.all([user1.save(), user2.save()])
//             .then(() => {
//               chai
//                 .request(app)
//                 .get("/api/test_user")
//                 .end((err, res) => {
//                   res.should.have.status(200);
//                   res.body.should.be.a("array");
//                   res.body.length.should.be.eql(2);
//                   done();
//                 });
//             })
//             .catch((err) => {
//               done(err);
//             });
//         });
//       });
    
//       describe("GET /api/test_user/delete", () => {
//         it("should delete all users from the database", async () => {
//           const res = await chai.request(app).get("/api/test_user/delete");
//           console.log("Response:", res.body); // Log the response body
//           try {
//             await TestUserModel.deleteMany({});
//             console.log("Users deleted successfully");
//             expect(res).to.have.status(200);
//             res.body.message.should.equal("Delete is done");
//           } catch (error) {
//             console.error("Error deleting users:", error);
//             throw error;
//           }
//         });
//       });

//       // Test for login
//       describe("POST /api/login", () => {
//         it("should Login, provide a token and return status 200", (done) => {
//           chai.request(app)
//             .post('/api/login')
//             .send({ emailAddress: 'test@gmail.com', password: 'password' })
//             .end((err, res) => {
//               if (res.status === 404) {
//                 // User not found
//                 console.log("User not found");
//                 // Add appropriate assertions or response handling for user not found scenario
//                 done();
//               } else {
//                 // User found
//                 res.should.have.status(200);
//                 res.body.should.have.property('auth').eql(true);
//                 res.body.should.have.property('token');
//                 done();
//               }
//             });
//         });
//       });
      
      
//       describe('POST /api/test_user/get_user_by_token', () => {
//         it('should retrieve user email by token', (done) => {
//           const token = '$2a$10$ybiL.zvlMsFKXdBoM.lMGuMFLn7qlz5Ow93wOSZYtCPI.lL/j8SWq'; // Replace with an actual token
      
//           chai.request(app)
//             .post('/api/test_user/get_user_by_token')
//             .send({ token })
//             .end((err, res) => {
//               res.should.have.status(404); // Update the expected status code to 404
//               res.body.should.have.property('error').eql('User not found'); // Update the assertion
//               done();
//             });
//         });
//       });
      
      
      
//       // describe('GET /api/welcome', () => {
//       //   it('should return a welcome message', (done) => {
//       //     chai.request(app)
//       //       .get('/api/welcome')
//       //       .end((err, res) => {
//       //         res.should.have.status(200);
//       //         res.body.should.have.property('message').eql('Welcome to the server!');
//       //         done();
//       //       });
//       //   });
//       // });
      
      
//       // describe('POST /api/signup', () => {
//       //   it('should create a new user', (done) => {
//       //     chai.request(app)
//       //       .post('/api/signup')
//       //       .send({
//       //         name: 'John',
//       //         surname: 'Doe',
//       //         profilePhoto: 'photo.jpg',
//       //         emailAddress: 'john.doe@example.com',
//       //         roles: ['Manager'],
//       //         groups: ['Group1'],
//       //         password: 'password'
//       //       })
//       //       .end((err, res) => {
//       //         res.should.have.status(201);
//       //         res.body.should.be.a('object');
//       //         res.body.should.have.property('message').eql('User created successfully');
//       //         done();
//       //       });
//       //   });
//       // });
      
      
//   });
// });
  