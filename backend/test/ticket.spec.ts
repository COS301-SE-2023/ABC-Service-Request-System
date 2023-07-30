import "mocha"
import mongoose from 'mongoose';
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/server";
import { server } from "../src/server";

const fs = require('fs');
const path = require('path');

import { TestTicketModel } from "../src/test_routers/testTicket.model";

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

// // describe('/Deleting database'), () => {
// //     it('should delete the database...'), async() => {
// //         const res = await chai.request(app)
// //             .get('/api/test_ticket/delete');
        
// //         res.should.have.status(200);
// //         res.body.should.be.a('object');
// //         expect(res.body.message).to.be.equal('Delete is done!');
// //     }
// // }

// describe('/Ticket test collection', () => {
//     it('should test welcome route...', async () => {
//         const res = await chai.request(app)
//             .get('/api/welcome');
//             chai.expect(res.text).to.equal(`{"message":"Welcome to the server!"}`);
//             //IF WE DONT WANT TO CHECK FOR AN OBJECT AND JUST WANT TO CHECK FOR THE STRING:
//             const actualValue = res.body.message;
//             chai.expect(actualValue).to.be.equal("Welcome to the server!");
//             //////////////////////////////////////////////////////////////////////////////

//         res.body.should.be.a('object');
//         res.should.have.status(200);
//     });

//     it('should verify that we have no tickets in the DB...', async () => {
//         const res = await chai.request(app)
//             .get('/api/test_ticket');

//         res.should.have.status(200);
//         res.body.should.be.a('array');
//         res.body.should.have.lengthOf(0);
//     });

//     it('should POST sample_tickets data...', async () => {
//         const res = await chai.request(app)
//             .post('/api/test_ticket/seed');
        
//         res.should.have.status(201);
//         res.body.should.be.a('array');
//         res.body.should.have.lengthOf(3);
//     });

//     it('should not seed an already seeded database...', async () => {
//         const res = await chai.request(app)
//             .post('/api/test_ticket/seed');
//         res.should.have.status(400);
//         res.body.should.be.a('object');
//         expect(res.body.message).to.be.equal('Seed is already done');
//     });


//     it('should check that comments for user 1 is empty at first...', async () => {
//         let userId = '1';

//         const res = await chai.request(app)
//             .get('/api/test_ticket/id')
//             .query({ id: userId});

//         res.should.have.status(200);
//         res.body.should.be.a('object');
//         expect(res.body).to.have.property('comments');
//         res.body.comments.should.be.a('array');
//         res.body.comments.should.have.lengthOf(0);
//     });

//     it('should add a comment to user 1...', async () => {

//         const toSend = {
//             ticketId: '1',
//             comment: 'hi',
//             author: 'John',
//             type: 'comment'
//         }

//         const res = await chai.request(app)
//             .put('/api/test_ticket/comment')
//             .send(toSend);

//         res.should.have.status(200);
//         res.body.should.be.a('object');
//         expect(res.body.message).to.be.equal('Comment added successfully');
//     });

//     it('should check that comments for user 1 has a single item and the content of the message should be "hi"...', async () => {
//         let userId = '1';

//         const res = await chai.request(app)
//             .get('/api/test_ticket/id')
//             .query({ id: userId});

//         res.should.have.status(200);
//         res.body.should.be.a('object');
//         expect(res.body).to.have.property('comments');
//         res.body.comments.should.be.a('array');
//         res.body.comments.should.have.lengthOf(1);
//         expect(res.body.comments[0]).to.have.property('content');
//         res.body.comments[0].content.should.be.a('string');
//         expect(res.body.comments[0].content).to.be.equal('hi');
//     });

//     it('should return 404 when an invalid ticket ID is being accessed...', async () => {
//         let userId = '20';

//         const res = await chai.request(app)
//             .get('/api/test_ticket/id')
//             .query({ id: userId});
//         res.should.have.status(404);
//         res.body.should.be.a('object');
//         expect(res.body.message).to.be.equal('Id not found');
//     });

//     it('should update the status of a ticket...', async () => {
//         const toSend = {
//             ticketId: '1',
//             status: 'Pending'
//         }

//         const res = await chai.request(app)
//             .put('/api/test_ticket/updateStatus')
//             .send(toSend);

//         res.should.have.status(200);
//         // const responseBody = JSON.parse(res.body);
//         // responseBody.should.be.a('object');
//         res.body.should.be.a('object');
//         expect(res.body.message).to.be.equal('Ticket status updated successfully');
//     });

//     it('should not update the status of a ticket that doesnt exist...', async () => {
//         const toSend = {
//             ticketId: '99999',
//             status: 'Pending'
//         }

//         const res = await chai.request(app)
//             .put('/api/test_ticket/updateStatus')
//             .send(toSend);

//         res.should.have.status(404);
//         res.body.should.be.a('object');
//         expect(res.body.message).to.be.equal('Ticket not found');
//     });

//     it('should add a comment to a ticket...', async () => {
//         const toSend = {
//             ticketId: '1',
//             comment: 'This is a test comment',
//             author: 'Test Author',
//             type: 'comment',
//             attachment: { name: '', url: '' },
//         }

//         const res = await chai.request(app)
//             .put('/api/test_ticket/comment')
//             .send(toSend);

//         res.should.have.status(200);
//         res.body.should.be.a('object');
//         expect(res.body.message).to.be.equal('Comment added successfully');
//     });

//     it('should not add a comment to a ticket that doesnt exist...', async () => {
//         const toSend = {
//             ticketId: '99999',
//             comment: 'This is a test comment',
//             author: 'Test Author',
//             type: 'comment',
//             attachment: { name: '', url: '' },
//         }

//         const res = await chai.request(app)
//             .put('/api/test_ticket/comment')
//             .send(toSend);

//         res.should.have.status(404);
//         res.body.should.be.a('object');
//         expect(res.body.message).to.be.equal('Ticket not found');
//     });

//     it('should fail when no file is attached', async () => {
//         const res = await chai.request(app)
//             .post('/api/test_ticket/upload');

//         res.should.have.status(400);
//         res.body.should.be.a('object');
//         expect(res.body.message).to.be.equal('No file uploaded');
//     });

//     // it('should fail when a wrong format file is attached', async () => {
//     //     const filePath = process.env.GITHUB_ACTIONS
//     //         ? path.join(process.cwd(), 'test.png') // GitHub environment
//     //         : path.join(__dirname, 'test.png');    // Local environment
//     //     const file = 'file';

//     //     const res = await chai.request(app)
//     //         .post('/api/test_ticket/upload')
//     //         .attach(file, filePath);

//     //     res.should.have.status(500);
//     //     res.body.should.be.a('object');
//     //     expect(res.body.message).to.be.equal('File upload error');
//     // });

//     it('should delete the database...', async() => {
//         const res = await chai.request(app)
//             .get('/api/test_ticket/delete');
        
//         res.should.have.status(200);
//         // res.body.should.be.a('array');
//         // res.body.should.have.lengthOf(0);
//             res.body.should.be.a('object');
//             expect(res.body.message).to.be.equal('Delete is done!');
//     });
// })
//         res.body.should.be.a('object');
//         expect(res.body.message).to.be.equal('Delete is done!');
//     }
// }

describe('/Ticket test collection', () => {
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

    it('should not seed an already seeded database...', async () => {
        const res = await chai.request(app)
            .post('/api/test_ticket/seed');
        res.should.have.status(400);
        res.body.should.be.a('object');
        expect(res.body.message).to.be.equal('Seed is already done');
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

    it('should check that comments for user 1 has a single item and the content of the message should be "hi"...', async () => {
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

    it('should update the status of a ticket...', async () => {
        const toSend = {
            ticketId: '1',
            status: 'Pending'
        }

        const res = await chai.request(app)
            .put('/api/test_ticket/updateStatus')
            .send(toSend);

        res.should.have.status(200);
        // const responseBody = JSON.parse(res.body);
        // responseBody.should.be.a('object');
        res.body.should.be.a('object');
        expect(res.body.message).to.be.equal('Ticket status updated successfully');
    });

    it('should not update the status of a ticket that doesnt exist...', async () => {
        const toSend = {
            ticketId: '99999',
            status: 'Pending'
        }

        const res = await chai.request(app)
            .put('/api/test_ticket/updateStatus')
            .send(toSend);

        res.should.have.status(404);
        res.body.should.be.a('object');
        expect(res.body.message).to.be.equal('Ticket not found');
    });

    it('should add a comment to a ticket...', async () => {
        const toSend = {
            ticketId: '1',
            comment: 'This is a test comment',
            author: 'Test Author',
            type: 'comment',
            attachment: { name: '', url: '' },
        }

        const res = await chai.request(app)
            .put('/api/test_ticket/comment')
            .send(toSend);

        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(res.body.message).to.be.equal('Comment added successfully');
    });

    it('should not add a comment to a ticket that doesnt exist...', async () => {
        const toSend = {
            ticketId: '99999',
            comment: 'This is a test comment',
            author: 'Test Author',
            type: 'comment',
            attachment: { name: '', url: '' },
        }

        const res = await chai.request(app)
            .put('/api/test_ticket/comment')
            .send(toSend);

        res.should.have.status(404);
        res.body.should.be.a('object');
        expect(res.body.message).to.be.equal('Ticket not found');
    });

    it('should fail when no file is attached', async () => {
        const res = await chai.request(app)
            .post('/api/test_ticket/upload');

        res.should.have.status(400);
        res.body.should.be.a('object');
        expect(res.body.message).to.be.equal('No file uploaded');
    });

    // it('should fail when a wrong format file is attached', async () => {
    //     const filePath = process.env.GITHUB_ACTIONS
    //         ? path.join(process.cwd(), 'test.png') // GitHub environment
    //         : path.join(__dirname, 'test.png');    // Local environment
    //     const file = 'file';

    //     const res = await chai.request(app)
    //         .post('/api/test_ticket/upload')
    //         .attach(file, filePath);

    //     res.should.have.status(500);
    //     res.body.should.be.a('object');
    //     expect(res.body.message).to.be.equal('File upload error');
    // });

    it('should return 200 with tickets when tickets are found',async () => {
        let userId = '1';
        const res = await chai.request(app)
            .get('/api/test_ticket/assigned')
            .query({ id: userId});
        res.should.have.status(200);
        res.body.should.be.a('array');
    });

    it('should return 404',async () => {
        let userId = '999999';
        const res = await chai.request(app)
            .get('/api/test_ticket/assigned')
            .query({ id: userId});
        res.should.have.status(404);
        res.body.should.be.a('object');
        expect(res.body.message).to.be.equal('No tickets found')
    });

    it('should return 200 with an array of projects',async () => {
        let groupId = '1';
        const res = await chai.request(app)
            .get('/api/test_ticket/projects')
            .query({groupName: groupId});
            res.should.have.status(200);
            res.body.should.be.a('array');
    });

    it('should return 200 with an array of tickets',async () => {
       let projectName = 'project';
       const res = await chai.request(app)
            .get('/api/test_ticket/project')
            .query({project: projectName}) ;
            res.should.have.status(200);
            res.body.should.be.a('array');
    });

    it('should return 404 with no tickets found',async () => {
        let projectName="";
        const res = await chai.request(app)
            .get('/api/test_ticket/project')
            .query({project: projectName});
            res.should.have.status(404);
            res.body.should.be.a('object');
            expect(res.body.message).to.be.equal("No tickets for this project");
        
    });

    it('should return 200 with an array of tickets',async () => {
        let groupId = '2';
        const res = await chai.request(app)
            .get('/api/test_ticket/group')
            .query({group: groupId});
            res.should.have.status(200);
            res.body.should.be.a('array');
    });
    it('should return 404 with a message "No tickets found for that group"',async () => {
        let groupId = "";
        const res = await chai.request(app)
            .get('/api/test_ticket/group')
            .query({group: groupId});
            res.should.have.status(404);
            res.body.should.be.a('object');
            expect(res.body.message).to.be.equal("No tickets found for that group");
    });

    it('should add a new ticket', async () => {
        const ticketCountBefore = await TestTicketModel.countDocuments();
    
        const newTicketData = {
          description: 'Test Ticket Description',
          summary: 'Test Ticket Summary',
          assignee: 'Test Assignee',
          assigned: 'Test Assigned',
          group: 'Test Group',
          priority: 'High',
          startDate: '2023-07-25',
          endDate: '2023-07-26',
          status: 'Open',
          project: 'Test Project',
          todo: ['Task 1', 'Task 2'],
          todoChecked: [false, true],
        };
    
        const res = await chai.request(app)
          .post('/api/test_ticket/addticket')
          .send(newTicketData);
    
        // Assertions
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('Ticket created succesfully');
    });

    // it('should add a time to first response if not set', async () => {
    //     const ticketId = '1';
    //     const commentTime = new Date();
    
    //     // Make a POST request to the /addTimeToFirstResponse route
    //     const res = await chai.request(app)
    //       .post('/api/test_ticket/addTimeToFirstResponse')
    //       .send({ ticketId, commentTime });
    //     // Assertions
    //     res.should.have.status(200);
    //     res.body.should.be.a('object');
    //     expect(res.body.message).to.equal('Time to first response added');
    //   });

    //   it('!!!!should not add a time to first response if not set!!!!', async () => {
    //     const ticketId = '1';
    //     const commentTime = new Date();
    
    //     // Make a POST request to the /addTimeToFirstResponse route
    //     const res = await chai.request(app)
    //       .post('/api/test_ticket/addTimeToFirstResponse')
    //       .send({ ticketId, commentTime });
    //     // Assertions
    //     res.should.have.status(200);
    //     res.body.should.be.a('object');
    //     expect(res.body.message).to.equal('First response time already recorded');
    //   });

    // it('should updateTodos and return 200 and a message', async () => {
    //     const id = '1';
    //     const todoChecked = [ true ];
    //     const res = await chai.request(app)
    //         .put('/api/test_ticket/updateTodoChecked/1')
    //         .send({ todoChecked: todoChecked });
    //         // console.log('HERE', res.body);
    //         res.should.have.status(200);
    //         res.body.should.be.an('object');
    //         expect(res.body.message).to.equal('Ticket todo checked updated');
    // })

    it('should not updateTodos and return 404 and a message', async () => {
        const id = '1';
        const updatedTodoChecked = true;
        const res = await chai.request(app)
            .put('/api/test_ticket/updateTodoChecked/999')
            .send({ todoChecked: updatedTodoChecked });
            res.should.have.status(404);
            res.body.should.be.an('object');
            expect(res.body.message).to.equal('Ticket not found');
    })
    
    it('should delete the database...', async() => {
        const res = await chai.request(app)
            .get('/api/test_ticket/delete');
        
        res.should.have.status(200);
        // res.body.should.be.a('array');
        // res.body.should.have.lengthOf(0);
            res.body.should.be.a('object');
            expect(res.body.message).to.be.equal('Delete is done!');
    });
})

