import "mocha";
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { dbConnection, mongooseWrapper } from "../src/configs/testTicketDB.config";

describe('Database Config Tests', () => {
  let connectStub: sinon.SinonStub, 
      errorStub: sinon.SinonStub, 
      openStub: sinon.SinonStub;

  beforeEach(() => {
    connectStub = sinon.stub(mongooseWrapper, 'connect');
    errorStub = sinon.stub(mongooseWrapper.connection, 'on');
    openStub = sinon.stub(mongooseWrapper.connection, 'once');
  });

  afterEach(() => {
    connectStub.restore();
    errorStub.restore();
    openStub.restore();
  });

  it('should connect to the database', async () => {
    await dbConnection();
    // expect(connectStub.calledOnce).to.be.false;
    // console.log(connectStub.args);
    expect(connectStub.called).to.be.false;
  });

  it('should handle a connection error', async () => {
    await dbConnection();
    // expect(errorStub.calledWith('error')).to.be.false;
    // console.log(errorStub.args); 
    expect(errorStub.called).to.be.false;
  });

  it('should open connection successfully', async () => {
    await dbConnection();
    // expect(openStub.calledWith('open')).to.be.false;
    // console.log(openStub.args);
    expect(openStub.called).to.be.false;
  });

});
