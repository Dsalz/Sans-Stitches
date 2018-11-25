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
      comment: 'Stolen Bicycle',
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
      comment: 'Sentors Looting',
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
        expect(res.body.status).to.equal(400);
        expect(res.body.data[0].message).to.equal('Invalid Description');
        done();
      });
  });

  it('should not save with invalid comment', (done) => {
    const record = {
      comment: true,
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
        expect(res.body.status).to.equal(400);
        expect(res.body.data[0].message).to.equal('Invalid Comment');
        done();
      });
  });

  it('should not save with only one geolocation parameter', (done) => {
    const record = {
      comment: 'Sentors Looting',
      description: 'Looted everywhere',
      latitude: '200W',
    };

    chai.request(app)
      .post(`${currApiPrefix}/red-flag`)
      .send(record)
      .set('authorization', `Bearer ${rightUserToken}`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(400);
        expect(res.body.data[0].message).to.equal('Invalid Geolocation Data');
        done();
      });
  });

  it('should not save without a comment', (done) => {
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
        expect(res.body.status).to.equal(400);
        expect(res.body.data[0].message).to.equal('Comment is Required');
        done();
      });
  });

  it('should save with just a comment', (done) => {
    const record = {
      comment: 'They Looted everywhere',
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
      comment: 'Stolen Bicycle',
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
        expect(res.body.status).to.equal(401);
        expect(res.body.data[0].message).to.equal('Invalid Token, Please Login or SignUp');
        done();
      });
  });

  it('should not save if user is not logged in', (done) => {
    const record = {
      comment: 'Stolen Bicycle',
      description: 'bicycle was stolen',
      latitude: '9000N',
      longitude: '643E',
    };

    chai.request(app)
      .post(`${currApiPrefix}/red-flag`)
      .send(record)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(401);
        expect(res.body.data[0].message).to.equal('Request has no Token, Please Login or SignUp');
        done();
      });
  });
});

describe('Attempt to delete red flag record', () => {
  it('should delete record if request is made by user who created it', (done) => {
    const newRecord = {
      comment: 'Badamosi is stealing again',
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
      comment: 'Badamosi is stealing again',
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
      comment: 'Badamosi is stealing again',
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
            expect(response.body.status).to.equal(401);
            expect(response.body.data[0].message).to.equal('Request has no Token, Please Login or SignUp');
            done();
          });
      });
  });

  it('should not delete record if request is not available or has been deleted before', (done) => {
    const newRecord = {
      comment: 'Badamosi is stealing again',
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

describe('Attempt to update red flag record comment', () => {
  let recentlyAddedRecordId;
  before((done) => {
    const newRecord = {
      comment: 'Bob Dylan is Stealing Money',
    };
    chai.request(app)
      .post(`${currApiPrefix}/red-flag`)
      .send(newRecord)
      .set('authorization', `Bearer ${rightUserToken}`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(200);
        recentlyAddedRecordId = res.body.data[0].id;
        done();
      });
  });

  it('should succeed if request is made by owner of the record and the new comment is valid', (done) => {
    const updatedRecord = {
      comment: 'Bob Dylan is stealing money from the senate',
    };
    chai.request(app)
      .patch(`${currApiPrefix}/red-flag/${recentlyAddedRecordId}/comment`)
      .send(updatedRecord)
      .set('authorization', `Bearer ${rightUserToken}`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(200);
        expect(res.body.data[0].id).to.equal(recentlyAddedRecordId);
        expect(res.body.data[0].message).to.equal('Updated red-flag record’s comment');
        done();
      });
  });

  it('should fail if request is not made by owner of the record', (done) => {
    const updatedRecord = {
      comment: 'Bob Dylan is stealing money from the senate',
    };
    chai.request(app)
      .patch(`${currApiPrefix}/red-flag/${recentlyAddedRecordId}/comment`)
      .send(updatedRecord)
      .set('authorization', `Bearer ${wrongUserToken}`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(403);
        expect(res.body.data[0].message).to.equal('You do not have permissions to update this record');
        done();
      });
  });

  it('should fail if user is not logged in', (done) => {
    const updatedRecord = {
      comment: 'Bob Dylan is stealing money from the senate',
    };
    chai.request(app)
      .patch(`${currApiPrefix}/red-flag/${recentlyAddedRecordId}/comment`)
      .send(updatedRecord)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(401);
        expect(res.body.data[0].message).to.equal('Request has no Token, Please Login or SignUp');
        done();
      });
  });

  it('should fail if new comment is not valid', (done) => {
    const updatedRecord = {
      comment: 3334,
    };
    chai.request(app)
      .patch(`${currApiPrefix}/red-flag/${recentlyAddedRecordId}/comment`)
      .send(updatedRecord)
      .set('authorization', `Bearer ${rightUserToken}`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(400);
        expect(res.body.data[0].message).to.equal('Invalid Comment');
        done();
      });
  });

  it('should fail if new comment is empty', (done) => {
    const updatedRecord = {
      comment: ' ',
    };
    chai.request(app)
      .patch(`${currApiPrefix}/red-flag/${recentlyAddedRecordId}/comment`)
      .send(updatedRecord)
      .set('authorization', `Bearer ${rightUserToken}`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(400);
        expect(res.body.data[0].message).to.equal('Comment is Required');
        done();
      });
  });

  it('should fail if record does not exist', (done) => {
    const updatedRecord = {
      comment: 'Governor tikimasallah is embezlling funds',
    };
    chai.request(app)
      .patch(`${currApiPrefix}/red-flag/${recentlyAddedRecordId + 778976456776}/comment`)
      .send(updatedRecord)
      .set('authorization', `Bearer ${rightUserToken}`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(404);
        expect(res.body.data[0].message).to.equal('Record does not exist');
        done();
      });
  });
});

describe('Attempt to update red flag record location', () => {
  let recentlyAddedRecordId;
  before((done) => {
    const newRecord = {
      comment: 'Bob Dylan is Stealing Money',
      longitude: '3000E',
      latitude: '4320W',
    };
    chai.request(app)
      .post(`${currApiPrefix}/red-flag`)
      .send(newRecord)
      .set('authorization', `Bearer ${rightUserToken}`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(200);
        recentlyAddedRecordId = res.body.data[0].id;
        done();
      });
  });

  it('should succeed if request is made by owner of the record and the new location is valid', (done) => {
    const updatedRecord = {
      comment: 'Bob Dylan is stealing money from the senate',
      longitude: '300E',
      latitude: '420W',
    };
    chai.request(app)
      .patch(`${currApiPrefix}/red-flag/${recentlyAddedRecordId}/location`)
      .send(updatedRecord)
      .set('authorization', `Bearer ${rightUserToken}`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(200);
        expect(res.body.data[0].id).to.equal(recentlyAddedRecordId);
        expect(res.body.data[0].message).to.equal('Updated red-flag record’s location');
        done();
      });
  });

  it('should fail if request is not made by owner of the record', (done) => {
    const updatedRecord = {
      comment: 'Bob Dylan is stealing money from the senate',
      longitude: '3000E',
      latitude: '4320W',
    };
    chai.request(app)
      .patch(`${currApiPrefix}/red-flag/${recentlyAddedRecordId}/location`)
      .send(updatedRecord)
      .set('authorization', `Bearer ${wrongUserToken}`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(403);
        expect(res.body.data[0].message).to.equal('You do not have permissions to update this record');
        done();
      });
  });

  it('should fail if user is not logged in', (done) => {
    const updatedRecord = {
      comment: 'Bob Dylan is stealing money from the senate',
      longitude: '000E',
      latitude: '320W',
    };
    chai.request(app)
      .patch(`${currApiPrefix}/red-flag/${recentlyAddedRecordId}/location`)
      .send(updatedRecord)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(401);
        expect(res.body.data[0].message).to.equal('Request has no Token, Please Login or SignUp');
        done();
      });
  });

  it('should fail if new location is not valid', (done) => {
    const updatedRecord = {
      comment: 'Bob Dylan is stealing money from the senate',
      longitude: 888,
      latitude: 909,
    };
    chai.request(app)
      .patch(`${currApiPrefix}/red-flag/${recentlyAddedRecordId}/location`)
      .send(updatedRecord)
      .set('authorization', `Bearer ${rightUserToken}`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(400);
        expect(res.body.data[0].message).to.equal('Invalid Geolocation Data');
        done();
      });
  });

  it('should fail if only one geolocation coordinate is provided', (done) => {
    const updatedRecord = {
      comment: 'Bob Dylan is stealing money from the senate',
      longitude: '888E',
    };
    chai.request(app)
      .patch(`${currApiPrefix}/red-flag/${recentlyAddedRecordId}/location`)
      .send(updatedRecord)
      .set('authorization', `Bearer ${rightUserToken}`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(400);
        expect(res.body.data[0].message).to.equal('Invalid Geolocation Data');
        done();
      });
  });

  it('should fail if new location is an empty string', (done) => {
    const updatedRecord = {
      comment: 'Bob Dylan is stealing money from the senate',
      longitude: ' ',
      latitude: ' ',
    };
    chai.request(app)
      .patch(`${currApiPrefix}/red-flag/${recentlyAddedRecordId}/location`)
      .send(updatedRecord)
      .set('authorization', `Bearer ${rightUserToken}`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(400);
        expect(res.body.data[0].message).to.equal('Geolocation Data is Required');
        done();
      });
  });

  it('should fail if record does not exist', (done) => {
    const updatedRecord = {
      comment: 'Governor tikimasallah is embezlling funds',
      longitude: '000E',
      latitude: '320W',
    };
    chai.request(app)
      .patch(`${currApiPrefix}/red-flag/${recentlyAddedRecordId + 778976456776}/location`)
      .send(updatedRecord)
      .set('authorization', `Bearer ${rightUserToken}`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(404);
        expect(res.body.data[0].message).to.equal('Record does not exist');
        done();
      });
  });
});
