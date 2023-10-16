import chai from 'chai';
import chaiHttp from 'chai-http';
import { randomUUID } from 'node:crypto';
import app from '../index.js';
import populationData from '../data/city_population_obj.js';

chai.should();
chai.use(chaiHttp);

describe('API Endpoint /api/population/state/:state/city/:city', () => {
    describe('GET', () => {
        describe('Success', () => {
            it('200 - OK', (done) => {
                chai.request(app)
                    .get('/api/population/state/Florida/city/Orlando')
                    .set('Content-Type', 'application/json')
                    .end((_, response) => {
                        response.should.have.status(200);
                        response.should.to.be.json;
                        response.body.should.be.a('object');
                        response.body.should.have.property('population');
                        response.body.population.should.be.equal(populationData.Florida.Orlando);
                        done();
                    });
            });
        });

        describe('Error', () => {
            it('400 - City or State not found', (done) => {
                chai.request(app)
                    .get('/api/population/state/Canada/city/Orlando')
                    .set('Content-Type', 'application/json')
                    .end((_, response) => {
                        response.should.have.status(400);
                        response.should.to.be.json;
                        response.body.should.be.a('object');
                        response.body.should.have.property('error');
                        response.body.error.should.be.equal('State or City could not be found!');
                        done();
                    });
            });
    
            it('400 - Invalid State params', (done) => {
                chai.request(app)
                    .get('/api/population/state/%20/city/Orlando')
                    .set('Content-Type', 'application/json')
                    .end((_, response) => {
                        response.should.have.status(400);
                        response.should.to.be.json;
                        response.body.should.be.a('object');
                        response.body.should.have.property('error');
                        response.body.error.should.be.equal('State parameter is invalid!');
                        done();
                    });
            });
    
            it('400 - Invalid City params', (done) => {
                chai.request(app)
                    .get('/api/population/state/Florida/city/%20')
                    .set('Content-Type', 'application/json')
                    .end((_, response) => {
                        response.should.have.status(400);
                        response.should.to.be.json;
                        response.body.should.be.a('object');
                        response.body.should.have.property('error');
                        response.body.error.should.be.equal('City parameter is invalid!');
                        done();
                    });
            });
        });
    });

    describe('PUT', () => {
        const population = Math.floor(Math.random() * 1000000);

        describe('Success', () => {
            it('201 - Created population value successfully', (done) => {
                const newValue1 = randomUUID();
                const newValue2 = randomUUID();

                chai.request(app)
                    .put(`/api/population/state/${newValue1}/city/${newValue2}`)
                    .set('Content-Type', 'text/plain')
                    .send(population.toString())
                    .end((_, response) => {
                        response.should.have.status(201);
                        response.should.to.be.json;
                        response.body.should.be.a('object');
                        response.body.should.have.property('population');
                        response.body.population.should.be.equal(population);
                        done();
                    });
            });
    
            it('200 - Updated population value successfully', (done) => {
                chai.request(app)
                    .put('/api/population/state/Virginia/city/Alexandria')
                    .set('Content-Type', 'text/plain')
                    .send(population.toString())
                    .end((_, response) => {
                        response.should.have.status(200);
                        response.should.to.be.json;
                        response.body.should.be.a('object');
                        response.body.should.have.property('population');
                        response.body.population.should.be.equal(population);
                        done();
                    });
            });
        });

        describe('Error', () => {
            it('400 - Invalid State params', (done) => {
                chai.request(app)
                    .put('/api/population/state/%20/city/Alexandria')
                    .set('Content-Type', 'text/plain')
                    .send(population.toString())
                    .end((_, response) => {
                        response.should.have.status(400);
                        response.should.to.be.json;
                        response.body.should.be.a('object');
                        response.body.should.have.property('error');
                        response.body.error.should.be.equal('State parameter is invalid!');
                        done();
                    });
            });
    
            it('400 - Invalid City params', (done) => {
                chai.request(app)
                    .put('/api/population/state/Virginia/city/%20')
                    .set('Content-Type', 'text/plain')
                    .send(population.toString())
                    .end((_, response) => {
                        response.should.have.status(400);
                        response.should.to.be.json;
                        response.body.should.be.a('object');
                        response.body.should.have.property('error');
                        response.body.error.should.be.equal('City parameter is invalid!');
                        done();
                    });
            });

            it('400 - Invalid Content Type', (done) => {
                chai.request(app)
                    .put('/api/population/state/Virginia/city/Alexandria')
                    .set('Content-Type', 'application/json')
                    .send(population.toString())
                    .end((_, response) => {
                        response.should.have.status(400);
                        response.should.to.be.json;
                        response.body.should.be.a('object');
                        response.body.should.have.property('error');
                        response.body.error.should.be.equal('The body MIME type is invalid!');
                        done();
                    });
            });
    
            it('400 - Invalid Body value', (done) => {
                chai.request(app)
                    .put('/api/population/state/Virginia/city/Alexandria')
                    .set('Content-Type', 'text/plain')
                    .send('HARAMBE!')
                    .end((_, response) => {
                        response.should.have.status(400);
                        response.should.to.be.json;
                        response.body.should.be.a('object');
                        response.body.should.have.property('error');
                        response.body.error.should.be.equal('The population value is invalid!');
                        done();
                    });
            });
        });
    });
});