var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../../helpers/config').test.testServer;
var should = chai.should();
chai.use(chaiHttp);

describe('Orders Controller', function () {
    it('createOrder /orders POST');
    it('listOrder /orders?page=:page&limit=:limit GET');
    it('takeOrder /orders/<id> PATCH');

    it('createOrder /orders POST', function (done) {
        chai.request(server)
            .post('/orders')
            .send({
                origin: ["-33.86748", "151.20699"],
                destination: ["-33.861483", "151.207279"]
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('status');
                res.body.should.have.property('id');
                res.body.should.have.property('distance');
                res.body.distance.should.equal('752');
                res.body.status.should.equal('UNASSIGNED');
                done();
            });
    });

    it('takeOrder /orders/<id> PATCH', function (done) {
        chai.request(server)
            .post('/orders')
            .send({
                origin: ["-33.86748", "151.20699"],
                destination: ["-33.861483", "151.207279"]
            })
            .end(function (err, response) {
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('id');
                chai.request(server)
                    .patch('/orders/' + response.body.id)
                    .send({
                        "status": "TAKEN"
                    })
                    .end(function (err, res) {
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.have.property('status');
                        res.body.status.should.equal('SUCCESS');
                        done();
                    });
            });
    });

    it('listOrder /orders?page=:page&limit=:limit GET', function (done) {
        chai.request(server)
            .get('/orders?page=1&limit=1')
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

});