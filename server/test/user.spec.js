import { describe, it, before } from 'mocha';
import chai, { expect } from 'chai';
import chaihttp from 'chai-http';
import app from '../server';

chai.use(chaihttp);

const should = require('chai').should();

const currApiPrefix = '/api/v1';

before((done) => {
  const newUser = {
    name: 'Damola Makinaki',
    email: 'duplicationtestemail@yahoo.com',
    phoneNumber: '08123456789',
    password: '12345',
    confirmPassword: '12345',
  };
  chai.request(app)
    .post(`${currApiPrefix}/auth/signup`)
    .send(newUser)
    .end((err, res) => {
      should.not.exist(err);
      expect(res.body.status).to.equal(200);
      done();
    });
});

describe('An Attempt to SignUp', () => {
  it('should succeed if fields are valid', () => {
    const newUser = {
      name: 'Damola Makinaki',
      email: 'mainaki@yahoo.com',
      phoneNumber: '08123456789',
      password: '12345',
      confirmPassword: '12345',
    };
    chai.request(app)
      .post(`${currApiPrefix}/auth/signup`)
      .send(newUser)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(200);
        expect(res.body.data[0].user.email).to.equal(newUser.email);
        expect(res.body.data[0].user.phone_number).to.equal(newUser.phoneNumber);
        expect(res.body.data[0].message).to.equal('Succesful Sign Up');
      });
  });

  it('should fail if name field is invalid', () => {
    const newUser = {
      name: 5,
      email: 'makna@yahoo.com',
      phoneNumber: '08123456789',
      password: '12345',
      confirmPassword: '12345',
    };
    chai.request(app)
      .post(`${currApiPrefix}/auth/signup`)
      .send(newUser)
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body.error[0].name).to.equal('Invalid Name');
      });
  });

  it('should fail if name is an empty string', () => {
    const newUser = {
      name: ' ',
      email: 'makina@yahoo.com',
      phoneNumber: '08123456789',
      password: '12345',
      confirmPassword: '12345',
    };
    chai.request(app)
      .post(`${currApiPrefix}/auth/signup`)
      .send(newUser)
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body.error[0].name).to.equal('Name is Required');
      });
  });

  it('should fail if email is an empty string', () => {
    const newUser = {
      name: 'Steph',
      email: ' ',
      phoneNumber: '08123456789',
      password: '12345',
      confirmPassword: '12345',
    };
    chai.request(app)
      .post(`${currApiPrefix}/auth/signup`)
      .send(newUser)
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body.error[0].email).to.equal('Invalid Email');
      });
  });

  it('should fail if password is an empty string', () => {
    const newUser = {
      name: 'Steph',
      email: 'makin@yahoo.com',
      phoneNumber: '08123456789',
      password: ' ',
      confirmPassword: ' ',
    };
    chai.request(app)
      .post(`${currApiPrefix}/auth/signup`)
      .send(newUser)
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body.error[0].password).to.equal('Password is Required');
      });
  });

  it('should fail if phone number is an empty string', () => {
    const newUser = {
      name: 'Steph',
      email: 'jojo@yahoo.com',
      phoneNumber: ' ',
      password: '12345',
      confirmPassword: '12345',
    };
    chai.request(app)
      .post(`${currApiPrefix}/auth/signup`)
      .send(newUser)
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body.error[0].phoneNumber).to.equal('Invalid Phone Number');
      });
  });

  it('should fail if email field is invalid', () => {
    const newUser = {
      name: 'Steph Curry',
      email: 'makinakiyahoo.com',
      phoneNumber: '08123456789',
      password: '12345',
      confirmPassword: '12345',
    };
    chai.request(app)
      .post(`${currApiPrefix}/auth/signup`)
      .send(newUser)
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body.error[0].email).to.equal('Invalid Email');
      });
  });

  it('should fail if phone number field is invalid', () => {
    const newUser = {
      name: 'Steph Curry',
      email: 'makinak@yahoo.com',
      phoneNumber: 3,
      password: '12345',
      confirmPassword: '12345',
    };
    chai.request(app)
      .post(`${currApiPrefix}/auth/signup`)
      .send(newUser)
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body.error[0].phoneNumber).to.equal('Invalid Phone Number');
      });
  });

  it('should fail if password and confirm password do not match', () => {
    const newUser = {
      name: 'Damola Salisu',
      email: 'makinaki@yahoo.com',
      phoneNumber: '08123456789',
      password: '12345',
      confirmPassword: '12346',
    };
    chai.request(app)
      .post(`${currApiPrefix}/auth/signup`)
      .send(newUser)
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body.error[0].password).to.equal('Password and Confirm Password do not match');
      });
  });

  it('should fail if name is not given', () => {
    const newUser = {
      email: 'makinaki@yahoo.com',
      phoneNumber: '08123456789',
      password: '12345',
      confirmPassword: '12345',
    };
    chai.request(app)
      .post(`${currApiPrefix}/auth/signup`)
      .send(newUser)
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body.error[0].name).to.equal('Name is Required');
      });
  });

  it('should fail if email is not given', () => {
    const newUser = {
      name: 'makinaki',
      phoneNumber: '08123456789',
      password: '12345',
      confirmPassword: '12345',
    };
    chai.request(app)
      .post(`${currApiPrefix}/auth/signup`)
      .send(newUser)
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body.error[0].email).to.equal('Email is Required');
      });
  });

  it('should fail if password is not given', () => {
    const newUser = {
      name: 'makinaki',
      email: 'makinaki@yahoo.com',
      phoneNumber: '08123456789',
      confirmPassword: '12345',
    };
    chai.request(app)
      .post(`${currApiPrefix}/auth/signup`)
      .send(newUser)
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body.error[0].password).to.equal('Password is Required');
      });
  });

  it('should fail if phone number is not given', () => {
    const newUser = {
      name: 'makinaki',
      email: 'makinaki@yahoo.com',
      password: '12345',
      confirmPassword: '12345',
    };
    chai.request(app)
      .post(`${currApiPrefix}/auth/signup`)
      .send(newUser)
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body.error[0].phoneNumber).to.equal('Phone Number is Required');
      });
  });

  it('should fail if email already exists', (done) => {
    const newUser = {
      name: 'Damola Makinaki',
      email: 'duplicationtestemail@yahoo.com',
      phoneNumber: '08123456789',
      password: '12345',
      confirmPassword: '12345',
    };
    chai.request(app)
      .post(`${currApiPrefix}/auth/signup`)
      .send(newUser)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(409);
        expect(res.body.error).to.equal('Email already Exists');
        done();
      });
  });
});

describe('An Attempt to Login', () => {
  it('should succeed if fields are valid and user exists', (done) => {
    const returningUser = {
      email: 'duplicationtestemail@yahoo.com',
      password: '12345',
    };
    chai.request(app)
      .post(`${currApiPrefix}/auth/login`)
      .send(returningUser)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(200);
        expect(res.body.data[0].user.email).to.equal(returningUser.email);
        expect(res.body.data[0].message).to.equal('Succesful Login');
        done();
      });
  });

  it('should fail if user does not exist', (done) => {
    const returningUser = {
      email: 'userwhodeosntexist@yahoo.com',
      password: '12345',
    };
    chai.request(app)
      .post(`${currApiPrefix}/auth/login`)
      .send(returningUser)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(404);
        expect(res.body.error).to.equal('User Not Found');
        done();
      });
  });

  it('should fail if email field is invalid', (done) => {
    const returningUser = {
      email: 'duplicationtestemailyahoo.com',
      password: '12345',
    };
    chai.request(app)
      .post(`${currApiPrefix}/auth/login`)
      .send(returningUser)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(400);
        expect(res.body.error[0].email).to.equal('Invalid Email');
        done();
      });
  });

  it('should fail if password field is invalid', (done) => {
    const returningUser = {
      email: 'duplicationtestemail@yahoo.com',
      password: true,
    };
    chai.request(app)
      .post(`${currApiPrefix}/auth/login`)
      .send(returningUser)
      .end((err, res) => {
        should.not.exist(err);
        expect(res.body.status).to.equal(400);
        expect(res.body.error[0].password).to.equal('Invalid Password');
        done();
      });
  });
});
