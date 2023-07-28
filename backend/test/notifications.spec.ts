import "mocha"
import mongoose from 'mongoose';
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/server";
import { server } from "../src/server";
import sinon from 'sinon';

import { TestNotificationsModel } from "../src/test_routers/testNotifications.model";

chai.use(chaiHttp);
chai.should();
const expect = chai.expect;

// First delete contents of the testNotifications database
before(async() => {
    await TestNotificationsModel.deleteMany({});
});

// ensure we close the database connection after we are done testing
after(async() => {
    await mongoose.connection.close();
    server.close();
});

describe('/Notifications test collection', () => {
    it('Should verify that we have no notifications in the DB...', async () => {
        const res = await chai.request(app)
            .get('/api/test_notifications');
        
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.should.have.lengthOf(0);
    });

    it('Should POST sample_notifications data...', async () => {
        const res = await chai.request(app)
            .post('/api/test_notifications/seed');
        
        res.should.have.status(201);
        res.body.should.be.a('array');
        res.body.should.have.lengthOf(3);
    });

    it('Seed should fail because data already exists...', async () => {
        const res = await chai.request(app)
            .post('/api/test_notifications/seed');

        res.should.have.status(400);
        res.body.should.be.a('object');
        expect(res.body.message).to.be.equal('Seed is already done');
    });

    it('Should add a new notification...', async () => {
        const toSend = {
            profilePhotoLink: 'https://i.imgur.com/zYxDCQT.jpg',
            notificationMessage: ' assigned an issue to you',
            creatorEmail: 'jesse@example.com',
            assignedEmail: 'dash@example.com',
            ticketSummary: 'Integration',
            ticketStatus: 'Pending',
            notificationTime: new Date(),
            link: '4',
            readStatus: "Unread"
        }

        const res = await chai.request(app)
            .post('/api/test_notifications/newnotif')
            .send(toSend);

        res.should.have.status(201);
        res.body.should.be.a('object');
        expect(res.body.message).to.be.equal('Notification created succesfully');
    });

    // it('Should fail to add a new notification...', async() => {
    //     const toSend = {
    //         profilePhotoLink: 'https://i.imgur.com/zYxDCQT.jpg',
    //         ticketSummary: 'Fail',
    //     }

    //     const res = await chai.request(app)
    //         .post('/api/test_notifications/newnotif')
    //         .send(toSend);

    //     res.should.have.status(500);
    //     res.body.should.be.a('object');
    //     expect(res.body.message).to.be.equal('An error occurred during notification creation.');
    // })

    it('Should check that notification 4 has ticketSummary = "Integration"...', async () => {    
        const res = await chai.request(app)
            .get('/api/test_notifications');
        
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.should.have.lengthOf(4);
        expect(res.body[3]).to.have.property('ticketSummary');
        res.body[3].ticketSummary.should.be.a('string');
        expect(res.body[3].ticketSummary).to.be.equal('Integration');
    });

    it('Should make notification 1 readStatus = "Read"...', async () => {

        const toSend = {
            notificationsId: "1",
            id: '1'
        }

        const res = await chai.request(app)
            .put('/api/test_notifications/changeToRead')
            .send(toSend);

        res.should.have.status(204);
        res.body.should.be.a('object');
    });

    it('Should fail in updating notification 5 readStatus = "Read" as notification doesnt exist...', async() => {
        const toSend = {
            notificationsId: "5",
            id: '5'
        }

        const res = await chai.request(app)
            .put('/api/test_notifications/changeToRead')
            .send(toSend);

        res.should.have.status(404);
        res.body.should.be.a('object');
        expect(res.body.message).to.be.equal('Notification not found');
    });

    // it('Should fail in updating notification with the wrong information...', async() => {
    //     const toSend = {}

    //     const res = await chai.request(app)
    //         .put('/api/test_notifications/changeToRead')
    //         .send(toSend);

    //     res.should.have.status(500);
    //     res.body.should.be.a('object');
    //     expect(res.body.message).to.be.equal('Internal server error');
    // });

    it('Should make notification 3 readStatus = "Unread"...', async () => {

        const toSend = {
            id: '3'
        }

        const res = await chai.request(app)
            .put('/api/test_notifications/changeToUnread')
            .send(toSend);

        res.should.have.status(204);
        res.body.should.be.a('object');
    });

    it('Should fail in updating notification 5 readStatus = "Unread" as notification doesnt exist...', async() => {
        const toSend = {
            id: '5'
        }

        const res = await chai.request(app)
            .put('/api/test_notifications/changeToUnread')
            .send(toSend);

        res.should.have.status(404);
        res.body.should.be.a('object');
        expect(res.body.message).to.be.equal('Notification not found');
    });

    it('Should get the notification 1 from id search...', async() => {
        const notificationId = "1";

        const res = await chai.request(app)
            .get(`/api/test_notifications/id`)
            .query({id: notificationId});

        res.body.should.be.a('object');
    });

    it('Should fail to get notification 5 from id search...', async() => {
        let notificationId = "5";

        const res = await chai.request(app)
            .get('/api/test_notifications/id')
            .query({id: notificationId});

        res.should.have.status(404);
        res.body.should.be.a('object');
        expect(res.body.message).to.be.equal('Notification not found');
    });

    it('Should delete the database...', async() => {
        const res = await chai.request(app)
            .get('/api/test_notifications/delete');

        res.body.should.be.a('object');
        expect(res.body.message).to.be.equal('Delete is done!');
    });
});
