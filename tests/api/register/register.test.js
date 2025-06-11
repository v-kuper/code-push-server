const { app } = require('../../../bin/app');
const request = require('supertest')(app);
const should = require('should');

describe('api/register/register.test.js', function () {
    it('should register user', function (done) {
        request
            .post('/api/auth/register')
            .send({ email: 'test@example.com', password: 'Password1!', name: 'test' })
            .end(function (err, res) {
                should.not.exist(err);
                const rs = JSON.parse(res.text);
                rs.should.have.property('success', true);
                done();
            });
    });
});
