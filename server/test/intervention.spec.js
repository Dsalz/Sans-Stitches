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
    name: 'Jack Franklin Bauer',
    email: 'jackieboy@yahoo.com',
    phoneNumber: '08123456700',
    password: 'xxxxxxx',
    confirmPassword: 'xxxxxxx',
  };
  chai.request(app)
    .post(`${currApiPrefix}/auth/signup`)
    .send(newUser)
    .end((err, res) => {
      rightUserToken = res.body.data[0].token;
      const anotherNewUser = {
        name: 'Jackie Chan',
        email: 'jackiechanizzle@yahoo.com',
        phoneNumber: '08198700001',
        password: 'xxxxxxx',
        confirmPassword: 'xxxxxxx',
      };
      chai.request(app)
        .post(`${currApiPrefix}/auth/signup`)
        .send(anotherNewUser)
        .end((error, response) => {
          wrongUserToken = response.body.data[0].token;
          done();
        });
    });
});

describe('Attempt to Create Intervention Record', () => {
  it('should save if fields are valid', (done) => {
    const record = {
      comment: 'Stolen Bicycle',
      description: 'bicycle was stolen',
      latitude: '9.074600',
      longitude: '6.43',
      images: ['http://place-hold.it/100', 'http://place-hold.it/120'],
      video: 'http://place-hold.it/200',
    };

    chai.request(app)
      .post(`${currApiPrefix}/interventions`)
      .set('authorization', `Bearer ${rightUserToken}`)
      .send(record)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(200);
        expect(res.body.data[0].message).to.equal('Created intervention record');
        expect(res.body.data[0].newRecord.comment).to.equal(record.comment);
        expect(res.body.data[0].newRecord.type).to.equal('intervention');
        expect(res.body.data[0].newRecord.description).to.equal(record.description);
        expect(res.body.data[0].newRecord.location).to.equal(`${record.latitude.trim()} , ${record.longitude.trim()}`);
        expect(res.body.data[0].newRecord.images[0]).to.equal(record.images[0]);
        expect(res.body.data[0].newRecord.images[1]).to.equal(record.images[1]);
        expect(res.body.data[0].newRecord.videos[0]).to.equal(record.video);
        done();
      });
  });

  it('should save with just a comment', (done) => {
    const record = {
      comment: 'They Looted everywhere',
    };

    chai.request(app)
      .post(`${currApiPrefix}/interventions`)
      .set('authorization', `Bearer ${rightUserToken}`)
      .send(record)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(200);
        expect(res.body.data[0].message).to.equal('Created intervention record');
        expect(res.body.data[0].newRecord.comment).to.equal(record.comment);
        done();
      });
  });

  it('should return an array of error messages if more than one field is invalid', (done) => {
    const newRecord = {
      comment: true,
      latitude: [],
      description: 4,
    };

    chai.request(app)
      .post(`${currApiPrefix}/interventions`)
      .set('authorization', ` Bearer ${rightUserToken}`)
      .send(newRecord)
      .end((err, resp) => {
        expect(resp.body.status).to.equal(400);
        expect(resp.body.error[0].comment).to.equal('Invalid Comment');
        expect(resp.body.error[1].description).to.equal('Invalid Description');
        expect(resp.body.error[2].geolocation).to.equal('Invalid Geolocation Data');
        done();
      });
  });

  it('should not save with invalid description', (done) => {
    const record = {
      comment: 'Sentors Looting',
      description: 2,
      latitude: '2.00',
      longitude: '3.898',
    };

    chai.request(app)
      .post(`${currApiPrefix}/interventions`)
      .set('authorization', `Bearer ${rightUserToken}`)
      .send(record)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(400);
        expect(res.body.error[0].description).to.equal('Invalid Description');
        done();
      });
  });

  it('should not save with invalid comment', (done) => {
    const record = {
      comment: true,
      description: 'Truly they stole',
      latitude: '2.008',
      longitude: '3.898',
    };

    chai.request(app)
      .post(`${currApiPrefix}/interventions`)
      .set('authorization', `Bearer ${rightUserToken}`)
      .send(record)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(400);
        expect(res.body.error[0].comment).to.equal('Invalid Comment');
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
      .post(`${currApiPrefix}/interventions`)
      .set('authorization', `Bearer ${rightUserToken}`)
      .send(record)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(400);
        expect(res.body.error[0].geolocation).to.equal('Invalid Geolocation Data');
        done();
      });
  });

  it('should not save without a comment', (done) => {
    const record = {
      description: 'Looted everywhere',
      latitude: '2.00',
      longitude: '3.804',
    };

    chai.request(app)
      .post(`${currApiPrefix}/interventions`)
      .set('authorization', `Bearer ${rightUserToken}`)
      .send(record)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(400);
        expect(res.body.error[0].comment).to.equal('Comment is Required');
        done();
      });
  });

  it('should not save if user token is invalid', (done) => {
    const record = {
      comment: 'Stolen Bicycle',
      description: 'bicycle was stolen',
      latitude: '9.5000',
      longitude: '-6.43',
    };

    chai.request(app)
      .post(`${currApiPrefix}/interventions`)
      .set('authorization', `Bearer ${fakeToken}`)
      .send(record)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(401);
        expect(res.body.error).to.equal('Invalid Token, Please Login or SignUp');
        done();
      });
  });

  it('should not save if user is not logged in', (done) => {
    const record = {
      comment: 'Stolen Bicycle',
      description: 'bicycle was stolen',
      latitude: '9.000',
      longitude: '6.43',
    };

    chai.request(app)
      .post(`${currApiPrefix}/interventions`)
      .send(record)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(401);
        expect(res.body.error).to.equal('Request has no Token, Please Login or SignUp');
        done();
      });
  });
});

describe('Attempt to delete intervention record', () => {
  it('should delete record if request is made by user who created it', (done) => {
    const newRecord = {
      comment: 'Badamosi is stealing again',
    };
    chai.request(app)
      .post(`${currApiPrefix}/interventions`)
      .set('authorization', `Bearer ${rightUserToken}`)
      .send(newRecord)
      .end((err, res) => {
        const savedRecordId = res.body.data[0].id;
        should.not.exist(err);
        chai.request(app)
          .delete(`${currApiPrefix}/interventions/${savedRecordId}`)
          .set('authorization', `Bearer ${rightUserToken}`)
          .end((error, response) => {
            should.not.exist(error);
            expect(response.body.status).to.equal(200);
            expect(response.body.data[0].id).to.equal(savedRecordId);
            expect(response.body.data[0].message).to.equal('intervention record has been deleted');
            expect(response.body.data[0].deletedRecord.comment).to.equal(newRecord.comment);
            expect(response.body.data[0].deletedRecord.id).to.equal(savedRecordId);
            done();
          });
      });
  });

  it('should not delete record if request is made user who did not create it', (done) => {
    const newRecord = {
      comment: 'Badamosi is stealing again',
    };
    chai.request(app)
      .post(`${currApiPrefix}/interventions`)
      .set('authorization', `Bearer ${rightUserToken}`)
      .send(newRecord)
      .end((err, res) => {
        const savedRecordId = res.body.data[0].id;
        should.not.exist(err);
        chai.request(app)
          .delete(`${currApiPrefix}/interventions/${savedRecordId}`)
          .set('authorization', `Bearer ${wrongUserToken}`)
          .end((error, response) => {
            should.not.exist(error);
            expect(response.body.status).to.equal(403);
            expect(response.body.error).to.equal('You do not have permissions to delete this record');
            done();
          });
      });
  });

  it('should not delete record if user is not logged in', (done) => {
    const newRecord = {
      comment: 'Badamosi is stealing again',
    };
    chai.request(app)
      .post(`${currApiPrefix}/interventions`)
      .set('authorization', `Bearer ${rightUserToken}`)
      .send(newRecord)
      .end((err, res) => {
        const savedRecordId = res.body.data[0].id;
        should.not.exist(err);
        chai.request(app)
          .delete(`${currApiPrefix}/interventions/${savedRecordId}`)
          .end((error, response) => {
            should.not.exist(error);
            expect(response.body.status).to.equal(401);
            expect(response.body.error).to.equal('Request has no Token, Please Login or SignUp');
            done();
          });
      });
  });

  it('should not delete record if request is not available or has been deleted before', (done) => {
    const newRecord = {
      comment: 'Badamosi is stealing again',
    };
    chai.request(app)
      .post(`${currApiPrefix}/interventions`)
      .set('authorization', `Bearer ${rightUserToken}`)
      .send(newRecord)
      .end((err, res) => {
        const savedRecordId = res.body.data[0].id;
        should.not.exist(err);
        chai.request(app)
          .delete(`${currApiPrefix}/interventions/${savedRecordId}`)
          .set('authorization', `Bearer ${rightUserToken}`)
          .end((error, response) => {
            const justDeletedRecordId = response.body.data[0].id;
            should.not.exist(error);
            chai.request(app)
              .delete(`${currApiPrefix}/interventions/${justDeletedRecordId}`)
              .set('authorization', `Bearer ${rightUserToken}`)
              .end((childerror, childresponse) => {
                should.not.exist(childerror);
                expect(childresponse.body.status).to.equal(404);
                expect(childresponse.body.error).to.equal('Record does not exist');
                done();
              });
          });
      });
  });
});

describe('Attempt to update intervention record comment', () => {
  let recentlyAddedRecordId;
  before((done) => {
    const newRecord = {
      comment: 'Bob Dylan is Stealing Money',
    };
    chai.request(app)
      .post(`${currApiPrefix}/interventions`)
      .set('authorization', `Bearer ${rightUserToken}`)
      .send(newRecord)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(200);
        recentlyAddedRecordId = res.body.data[0].id;
        done();
      });
  });

  it('should succeed if request is made by owner of the record and the new comment is valid', (done) => {
    const modifiedRecord = {
      comment: 'Bob Dylan is stealing money from the senate',
    };
    chai.request(app)
      .patch(`${currApiPrefix}/interventions/${recentlyAddedRecordId}/comment`)
      .set('authorization', `Bearer ${rightUserToken}`)
      .send(modifiedRecord)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(200);
        expect(res.body.data[0].id).to.equal(recentlyAddedRecordId);
        expect(res.body.data[0].message).to.equal('Updated intervention record’s comment');
        expect(res.body.data[0].updatedRecord.comment).to.equal(modifiedRecord.comment);
        expect(res.body.data[0].updatedRecord.id).to.equal(recentlyAddedRecordId);
        done();
      });
  });

  it('should fail if request is not made by owner of the record', (done) => {
    const updatedRecord = {
      comment: 'Bob Dylan is stealing money from the senate',
    };
    chai.request(app)
      .patch(`${currApiPrefix}/interventions/${recentlyAddedRecordId}/comment`)
      .set('authorization', `Bearer ${wrongUserToken}`)
      .send(updatedRecord)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(403);
        expect(res.body.error).to.equal('You do not have permissions to update the comment of this record');
        done();
      });
  });

  it('should fail if user is not logged in', (done) => {
    const updatedRecord = {
      comment: 'Bob Dylan is stealing money from the senate',
    };
    chai.request(app)
      .patch(`${currApiPrefix}/interventions/${recentlyAddedRecordId}/comment`)
      .send(updatedRecord)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(401);
        expect(res.body.error).to.equal('Request has no Token, Please Login or SignUp');
        done();
      });
  });

  it('should fail if new comment is not valid', (done) => {
    const updatedRecord = {
      comment: 3334,
    };
    chai.request(app)
      .patch(`${currApiPrefix}/interventions/${recentlyAddedRecordId}/comment`)
      .set('authorization', `Bearer ${rightUserToken}`)
      .send(updatedRecord)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(400);
        expect(res.body.error[0].comment).to.equal('Invalid Comment');
        done();
      });
  });

  it('should fail if new comment is empty', (done) => {
    const updatedRecord = {
      comment: ' ',
    };
    chai.request(app)
      .patch(`${currApiPrefix}/interventions/${recentlyAddedRecordId}/comment`)
      .set('authorization', `Bearer ${rightUserToken}`)
      .send(updatedRecord)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(400);
        expect(res.body.error[0].comment).to.equal('Comment is Required');
        done();
      });
  });

  it('should fail if record does not exist', (done) => {
    const updatedRecord = {
      comment: 'Governor tikimasallah is embezlling funds',
    };
    chai.request(app)
      .patch(`${currApiPrefix}/interventions/${recentlyAddedRecordId + 778}/comment`)
      .set('authorization', `Bearer ${rightUserToken}`)
      .send(updatedRecord)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(404);
        expect(res.body.error).to.equal('Record does not exist');
        done();
      });
  });
});

describe('Attempt to update intervention record location', () => {
  let recentlyAddedRecordId;
  before((done) => {
    const newRecord = {
      comment: 'Bob Dylan is Stealing Money',
      longitude: '3.000',
      latitude: '4.320',
    };
    chai.request(app)
      .post(`${currApiPrefix}/interventions`)
      .set('authorization', `Bearer ${rightUserToken}`)
      .send(newRecord)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(200);
        recentlyAddedRecordId = res.body.data[0].id;
        done();
      });
  });

  it('should succeed if request is made by owner of the record and the new location is valid', (done) => {
    const modifiedRecord = {
      longitude: '3.00',
      latitude: '4.987720',
    };
    chai.request(app)
      .patch(`${currApiPrefix}/interventions/${recentlyAddedRecordId}/location`)
      .set('authorization', `Bearer ${rightUserToken}`)
      .send(modifiedRecord)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(200);
        expect(res.body.data[0].id).to.equal(recentlyAddedRecordId);
        expect(res.body.data[0].message).to.equal('Updated intervention record’s location');
        expect(res.body.data[0].updatedRecord.location).to.equal(`${modifiedRecord.latitude.trim()} , ${modifiedRecord.longitude.trim()}`);
        expect(res.body.data[0].updatedRecord.id).to.equal(recentlyAddedRecordId);
        done();
      });
  });

  it('should fail if request is not made by owner of the record', (done) => {
    const updatedRecord = {
      longitude: '3.000',
      latitude: '4.320',
    };
    chai.request(app)
      .patch(`${currApiPrefix}/interventions/${recentlyAddedRecordId}/location`)
      .set('authorization', `Bearer ${wrongUserToken}`)
      .send(updatedRecord)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(403);
        expect(res.body.error).to.equal('You do not have permissions to update the location of this record');
        done();
      });
  });

  it('should fail if user is not logged in', (done) => {
    const updatedRecord = {
      longitude: '6.3000',
      latitude: '32.0',
    };
    chai.request(app)
      .patch(`${currApiPrefix}/interventions/${recentlyAddedRecordId}/location`)
      .send(updatedRecord)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(401);
        expect(res.body.error).to.equal('Request has no Token, Please Login or SignUp');
        done();
      });
  });

  it('should fail if new location is not valid', (done) => {
    const updatedRecord = {
      longitude: '888',
      latitude: '909',
    };
    chai.request(app)
      .patch(`${currApiPrefix}/interventions/${recentlyAddedRecordId}/location`)
      .set('authorization', `Bearer ${rightUserToken}`)
      .send(updatedRecord)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(400);
        expect(res.body.error[0].geolocation).to.equal('Invalid Geolocation Data');
        done();
      });
  });

  it('should fail if no location is given', (done) => {
    const updatedRecord = {};
    chai.request(app)
      .patch(`${currApiPrefix}/interventions/${recentlyAddedRecordId}/location`)
      .set('authorization', `Bearer ${rightUserToken}`)
      .send(updatedRecord)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(400);
        expect(res.body.error[0].geolocation).to.equal('Geolocation Data is Required');
        done();
      });
  });

  it('should fail if only one geolocation coordinate is provided', (done) => {
    const updatedRecord = {
      longitude: '-7.888',
    };
    chai.request(app)
      .patch(`${currApiPrefix}/interventions/${recentlyAddedRecordId}/location`)
      .set('authorization', `Bearer ${rightUserToken}`)
      .send(updatedRecord)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(400);
        expect(res.body.error[0].geolocation).to.equal('Invalid Geolocation Data');
        done();
      });
  });

  it('should fail if new location is an empty string', (done) => {
    const updatedRecord = {
      longitude: ' ',
      latitude: ' ',
    };
    chai.request(app)
      .patch(`${currApiPrefix}/interventions/${recentlyAddedRecordId}/location`)
      .set('authorization', `Bearer ${rightUserToken}`)
      .send(updatedRecord)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(400);
        expect(res.body.error[0].geolocation).to.equal('Geolocation Data is Required');
        done();
      });
  });

  it('should fail if record does not exist', (done) => {
    const updatedRecord = {
      longitude: '4.000',
      latitude: '3.2007456',
    };
    chai.request(app)
      .patch(`${currApiPrefix}/interventions/${recentlyAddedRecordId + 778}/location`)
      .set('authorization', `Bearer ${rightUserToken}`)
      .send(updatedRecord)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(404);
        expect(res.body.error).to.equal('Record does not exist');
        done();
      });
  });
});

describe('Attempt to get a specific intervention record', () => {
  let newRecordId = '';
  let newRecord = {};
  before((done) => {
    newRecord = {
      comment: 'Members of parliament are looting government funds',
    };
    chai.request(app)
      .post(`${currApiPrefix}/interventions`)
      .set('authorization', `Bearer ${rightUserToken}`)
      .send(newRecord)
      .end((err, res) => {
        should.not.exist(err);
        newRecordId = res.body.data[0].id;
        done();
      });
  });
  it('should get the record if it exists', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/interventions/${newRecordId}`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(200);
        expect(res.body.data[0].id).to.equal(newRecordId);
        expect(res.body.data[0].comment).to.equal(newRecord.comment);
        done();
      });
  });
  it('should fail if the record does not exist', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/interventions/${newRecordId + 980}`)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(404);
        expect(res.body.error).to.equal('Record does not exist');
        done();
      });
  });
});

describe('Attempt to get all intervention records', () => {
  let newRecordId = '';
  let newRecord = {};
  before((done) => {
    newRecord = {
      comment: 'Members of parliament are looting government funds',
    };
    chai.request(app)
      .post(`${currApiPrefix}/interventions`)
      .set('authorization', `Bearer ${rightUserToken}`)
      .send(newRecord)
      .end((err, res) => {
        should.not.exist(err);
        newRecordId = res.body.data[0].id;
        done();
      });
  });
  it('should get all records', (done) => {
    chai.request(app)
      .get(`${currApiPrefix}/interventions`)
      .end((err, res) => {
        const recordJustAdded = res.body.data.find(record => record.id === newRecordId);
        should.not.exist(err);
        expect(res.body.status).to.equal(200);
        expect(res.body.data.length).to.be.greaterThan(0);
        should.exist(recordJustAdded);
        done();
      });
  });
});

describe('Attempt to update intervention record status', () => {
  let recentlyAddedRecordId;
  let adminToken;
  before((done) => {
    const newRecord = {
      comment: 'Bob Dylan is Stealing Money',
    };
    chai.request(app)
      .post(`${currApiPrefix}/interventions`)
      .set('authorization', `Bearer ${rightUserToken}`)
      .send(newRecord)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(200);
        recentlyAddedRecordId = res.body.data[0].id;
        const AdminUser = {
          email: 'admin@yahoo.com',
          password: 'baddestadmineverliveth',
        };
        chai.request(app)
          .post(`${currApiPrefix}/auth/login`)
          .send(AdminUser)
          .end((error, response) => {
            should.not.exist(error);
            adminToken = response.body.data[0].token;
            done();
          });
      });
  });

  it('should succeed if request is made by admin', (done) => {
    const modifiedRecord = {
      status: 'under investigation',
      feedback: 'Investigation will begin on monday morning',
    };
    chai.request(app)
      .patch(`${currApiPrefix}/interventions/${recentlyAddedRecordId}/status`)
      .set('authorization', `Bearer ${adminToken}`)
      .send(modifiedRecord)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(200);
        expect(res.body.data[0].message).to.equal('Updated red-flag record’s status to under investigation');
        expect(res.body.data[0].updatedRecord.status).to.equal(modifiedRecord.status);
        expect(res.body.data[0].updatedRecord.feedback).to.equal(modifiedRecord.feedback);
        done();
      });
  });

  it('should fail if request is made by owner of the record', (done) => {
    const modifiedRecord = {
      status: 'resolved',
    };
    chai.request(app)
      .patch(`${currApiPrefix}/interventions/${recentlyAddedRecordId}/status`)
      .set('authorization', `Bearer ${rightUserToken}`)
      .send(modifiedRecord)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(403);
        expect(res.body.error).to.equal('You do not have permissions to update the status of this record');
        done();
      });
  });

  it('should fail if request is made by any other non admin', (done) => {
    const updatedRecord = {
      status: 'rejected',
    };
    chai.request(app)
      .patch(`${currApiPrefix}/interventions/${recentlyAddedRecordId}/status`)
      .set('authorization', `Bearer ${rightUserToken}`)
      .send(updatedRecord)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(403);
        expect(res.body.error).to.equal('You do not have permissions to update the status of this record');
        done();
      });
  });

  it('should fail if new status is not valid', (done) => {
    const updatedRecord = {
      status: 'in limbo',
    };
    chai.request(app)
      .patch(`${currApiPrefix}/interventions/${recentlyAddedRecordId}/status`)
      .set('authorization', `Bearer ${rightUserToken}`)
      .send(updatedRecord)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(400);
        expect(res.body.error[0].status).to.equal('Invalid Status');
        done();
      });
  });

  it('should fail if new status is empty', (done) => {
    const updatedRecord = {
      status: ' ',
    };
    chai.request(app)
      .patch(`${currApiPrefix}/interventions/${recentlyAddedRecordId}/status`)
      .set('authorization', `Bearer ${rightUserToken}`)
      .send(updatedRecord)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(400);
        expect(res.body.error[0].status).to.equal('Status is Required');
        done();
      });
  });

  it('should fail if feedback is invalid', (done) => {
    const updatedRecord = {
      status: 'resolved',
      feedback: 6,
    };
    chai.request(app)
      .patch(`${currApiPrefix}/interventions/${recentlyAddedRecordId}/status`)
      .set('authorization', `Bearer ${rightUserToken}`)
      .send(updatedRecord)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(400);
        expect(res.body.error[0].feedback).to.equal('Invalid Feedback');
        done();
      });
  });

  it('should fail if record does not exist', (done) => {
    const updatedRecord = {
      status: 'resolved',
    };
    chai.request(app)
      .patch(`${currApiPrefix}/interventions/${recentlyAddedRecordId + 778}/status`)
      .set('authorization', `Bearer ${rightUserToken}`)
      .send(updatedRecord)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(404);
        expect(res.body.error).to.equal('Record does not exist');
        done();
      });
  });
});
