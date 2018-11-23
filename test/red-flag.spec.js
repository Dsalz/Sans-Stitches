import chai , { should } from 'chai';
import chaihttp from 'chai-http';
import app from '../server';

chai.use(chaihttp);

const currApiPrefix = "/api/v1";

describe('Red Flag Record' , () => {
    
    it('should not post a record with invalid datatypes' , (done) => {
        let record = {
            title : 2,
            description : 33,
            latitude: 0,
            longitude: 12
        }

        chai.request(app)
        .post(`${currApiPrefix}/red-flag`)
        .send(record)
        .end((err , res) => {
            res.body.should.have.property('status').equal(500);
            res.body.data.should.be.a('array');
            res.body.should.have.property('data[0].message').equal('Invalid Entry');
        })
    })

})

