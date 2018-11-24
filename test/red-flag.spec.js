import { describe, it } from 'mocha';
import chai, { expect } from 'chai';
import chaihttp from 'chai-http';
import app from '../server';

chai.use(chaihttp);

const should = require('chai').should();

const currApiPrefix = '/api/v1';

describe('Red Flag Record', () => {
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
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(200);
        expect(res.body.data[0].message).to.equal('Created red-flag record');
        done();
      });
  });
});
