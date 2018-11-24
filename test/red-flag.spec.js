import { describe, it, before } from 'mocha';
import chai, { expect } from 'chai';
import chaihttp from 'chai-http';
import app from '../server';

chai.use(chaihttp);

const should = require('chai').should();

const currApiPrefix = '/api/v1';

let rightUserToken = '';

const fakeToken = 'stewwwwweverywhere';

let wrongUserToken = '';

before((done) => {
  const newUser = {
    name: 'Damola Mark Salisu',
    email: 'damo@yahoo.com',
    phoneNumber: '08123456789',
    password: 'xxxxxxx',
    confirmPassword: 'xxxxxxx',
  };
  chai.request(app)
    .post(`${currApiPrefix}/user/signup`)
    .send(newUser)
    .end((err, res) => {
      rightUserToken = res.body.data[0].token;
      const anotherNewUser = {
        name: 'Damola Moses Salisu',
        email: 'moses@yahoo.com',
        phoneNumber: '081987654321',
        password: 'xxxxxxx',
        confirmPassword: 'xxxxxxx',
      };
      chai.request(app)
        .post(`${currApiPrefix}/user/signup`)
        .send(anotherNewUser)
        .end((error, response) => {
          wrongUserToken = response.body.data[0].token;
          done();
        });
    });
});

describe('Attempt to Create Red Flag Record', () => {
  it('should save if fields are valid', (done) => {
    const record = {
      title: 'Stolen Bicycle',
      description: 'bicycle was stolen',
      latitude: '9000N',
      longitude: '643E',
    };

    chai.request(app)
      .post(`${currApiPrefix}/red-flag`)
      .send(record)
      .set('authorization', `Bearer ${rightUserToken}`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(200);
        expect(res.body.data[0].message).to.equal('Created red-flag record');
        done();
      });
  });

  it('should not save with invalid description', (done) => {
    const record = {
      title: 'Sentors Looting',
      description: 2,
      latitude: '200W',
      longitude: '3898E',
    };

    chai.request(app)
      .post(`${currApiPrefix}/red-flag`)
      .send(record)
      .set('authorization', `Bearer ${rightUserToken}`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(500);
        expect(res.body.data[0].message).to.equal('Invalid Description');
        done();
      });
  });

  it('should not save with invalid title', (done) => {
    const record = {
      title: true,
      description: 'Truly they stole',
      latitude: '200W',
      longitude: '3898E',
    };

    chai.request(app)
      .post(`${currApiPrefix}/red-flag`)
      .send(record)
      .set('authorization', `Bearer ${rightUserToken}`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(500);
        expect(res.body.data[0].message).to.equal('Invalid Title');
        done();
      });
  });

  it('should not save with only one geolocation parameter', (done) => {
    const record = {
      title: 'Sentors Looting',
      description: 'Looted everywhere',
      latitude: '200W',
    };

    chai.request(app)
      .post(`${currApiPrefix}/red-flag`)
      .send(record)
      .set('authorization', `Bearer ${rightUserToken}`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(500);
        expect(res.body.data[0].message).to.equal('Invalid Geolocation Data');
        done();
      });
  });

  it('should not save without a title', (done) => {
    const record = {
      description: 'Looted everywhere',
      latitude: '200W',
      longitude: '3804E',
    };

    chai.request(app)
      .post(`${currApiPrefix}/red-flag`)
      .send(record)
      .set('authorization', `Bearer ${rightUserToken}`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(500);
        expect(res.body.data[0].message).to.equal('Title is Required');
        done();
      });
  });

  it('should save with just a title', (done) => {
    const record = {
      title: 'They Looted everywhere',
    };

    chai.request(app)
      .post(`${currApiPrefix}/red-flag`)
      .send(record)
      .set('authorization', `Bearer ${rightUserToken}`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(200);
        expect(res.body.data[0].message).to.equal('Created red-flag record');
        done();
      });
  });

  it('should not save if user token is invalid', (done) => {
    const record = {
      title: 'Stolen Bicycle',
      description: 'bicycle was stolen',
      latitude: '9000N',
      longitude: '643E',
    };

    chai.request(app)
      .post(`${currApiPrefix}/red-flag`)
      .send(record)
      .set('authorization', `Bearer ${fakeToken}`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(403);
        expect(res.body.data[0].message).to.equal('Invalid Token');
        done();
      });
  });

  it('should not save if user is not logged in', (done) => {
    const record = {
      title: 'Stolen Bicycle',
      description: 'bicycle was stolen',
      latitude: '9000N',
      longitude: '643E',
    };

    chai.request(app)
      .post(`${currApiPrefix}/red-flag`)
      .send(record)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(403);
        expect(res.body.data[0].message).to.equal('Forbidden Request');
        done();
      });
  });
});

describe('Attempt to delete red flag record', () => {
  it('should delete record if request is made by user who created it', (done) => {
    const newRecord = {
      title: 'Badamosi is stealing again',
    };
    chai.request(app)
      .post(`${currApiPrefix}/red-flag`)
      .send(newRecord)
      .set('authorization', `Bearer ${rightUserToken}`)
      .end((err, res) => {
        const savedRecordId = res.body.data[0].id;
        should.not.exist(err);
        chai.request(app)
          .delete(`${currApiPrefix}/red-flag/${savedRecordId}`)
          .set('authorization', `Bearer ${rightUserToken}`)
          .end((error, response) => {
            should.not.exist(error);
            expect(response.body.status).to.equal(200);
            expect(response.body.data[0].id).to.equal(savedRecordId);
            expect(response.body.data[0].message).to.equal('red-flag record has been deleted');
            done();
          });
      });
  });

  it('should not delete record if request is made user who did not create it', (done) => {
    const newRecord = {
      title: 'Badamosi is stealing again',
    };
    chai.request(app)
      .post(`${currApiPrefix}/red-flag`)
      .send(newRecord)
      .set('authorization', `Bearer ${rightUserToken}`)
      .end((err, res) => {
        const savedRecordId = res.body.data[0].id;
        should.not.exist(err);
        chai.request(app)
          .delete(`${currApiPrefix}/red-flag/${savedRecordId}`)
          .set('authorization', `Bearer ${wrongUserToken}`)
          .end((error, response) => {
            should.not.exist(error);
            expect(response.body.status).to.equal(403);
            expect(response.body.data[0].message).to.equal('You do not have permissions to delete this record');
            done();
          });
      });
  });

  it('should not delete record if user is not logged in', (done) => {
    const newRecord = {
      title: 'Badamosi is stealing again',
    };
    chai.request(app)
      .post(`${currApiPrefix}/red-flag`)
      .send(newRecord)
      .set('authorization', `Bearer ${rightUserToken}`)
      .end((err, res) => {
        const savedRecordId = res.body.data[0].id;
        should.not.exist(err);
        chai.request(app)
          .delete(`${currApiPrefix}/red-flag/${savedRecordId}`)
          .end((error, response) => {
            should.not.exist(error);
            expect(response.body.status).to.equal(403);
            expect(response.body.data[0].message).to.equal('Forbidden Request');
            done();
          });
      });
  });

  it('should not delete record if request is not available or has been deleted before', (done) => {
    const newRecord = {
      title: 'Badamosi is stealing again',
    };
    chai.request(app)
      .post(`${currApiPrefix}/red-flag`)
      .send(newRecord)
      .set('authorization', `Bearer ${rightUserToken}`)
      .end((err, res) => {
        const savedRecordId = res.body.data[0].id;
        should.not.exist(err);
        chai.request(app)
          .delete(`${currApiPrefix}/red-flag/${savedRecordId}`)
          .set('authorization', `Bearer ${rightUserToken}`)
          .end((error, response) => {
            const justDeletedRecordId = response.body.data[0].id;
            should.not.exist(error);
            chai.request(app)
              .delete(`${currApiPrefix}/red-flag/${justDeletedRecordId}`)
              .set('authorization', `Bearer ${rightUserToken}`)
              .end((childerror, childresponse) => {
                should.not.exist(childerror);
                expect(childresponse.body.status).to.equal(404);
                expect(childresponse.body.data[0].message).to.equal('This record does not exist');
                done();
              });
          });
      });
  });
});
