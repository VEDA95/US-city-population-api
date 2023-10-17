import chai from 'chai';
import chaiHttp from 'chai-http';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import app from '../index.js';
import populationData from '../data/city_population_obj.js';

chai.should();
chai.use(chaiHttp);

describe('API Endpoint /api/population/state/:state/city/:city', () => {
    describe('GET', () => {
        describe('Success', () => {
            it('200 - OK', async () => {
                const response = await chai.request(app)
                                            .get('/api/population/state/Florida/city/Orlando')
                                            .set('Content-Type', 'application/json');

                response.should.have.status(200);
                response.should.to.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('population');
                response.body.population.should.be.equal(populationData.Florida.Orlando);

            });

            it('200 - Non Case-Sensitve', async () => {
                const response = await chai.request(app)
                                            .get('/api/population/state/florida/city/orlando')
                                            .set('Content-Type', 'application/json');

                response.should.have.status(200);
                response.should.to.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('population');
                response.body.population.should.be.equal(populationData.Florida.Orlando);

            });
        });

        describe('Error', () => {
            it('400 - City or State not found', async () => {
                const response = await chai.request(app)
                                            .get('/api/population/state/Canada/city/Orlando')
                                            .set('Content-Type', 'application/json');

                response.should.have.status(400);
                response.should.to.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('error');
                response.body.error.should.be.equal('State or City could not be found!');

            });

            it('400 - Invalid State params', async () => {
                const response = await chai.request(app)
                                            .get('/api/population/state/%20/city/Orlando')
                                            .set('Content-Type', 'application/json');

                response.should.have.status(400);
                response.should.to.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('error');
                response.body.error.should.be.equal('State parameter is invalid!');

            });

            it('400 - Invalid City params', async () => {
                const response = await chai.request(app)
                                            .get('/api/population/state/Florida/city/%20')
                                            .set('Content-Type', 'application/json');

                response.should.have.status(400);
                response.should.to.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('error');
                response.body.error.should.be.equal('City parameter is invalid!');

            });
        });
    });

    describe('PUT', () => {
        const population = Math.floor(Math.random() * 1000000);

        describe('Success', () => {
            it('201 - Created population value successfully', async () => {
                const newValue1 = randomUUID();
                const newValue2 = randomUUID();
                const response = await chai.request(app)
                                            .put(`/api/population/state/${newValue1}/city/${newValue2}`)
                                            .set('Content-Type', 'text/plain')
                                            .send(population.toString());

                response.should.have.status(201);
                response.should.to.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('population');
                response.body.population.should.be.equal(population);

            });

            it('200 - Updated population value successfully', async () => {
                const response = await chai.request(app)
                                            .put('/api/population/state/Virginia/city/Alexandria')
                                            .set('Content-Type', 'text/plain')
                                            .send(population.toString());

                response.should.have.status(200);
                response.should.to.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('population');
                response.body.population.should.be.equal(population);

            });

            it('200 - Updated population value successfully - Non Case-Sensitive', async () => {
                const altPopulation = Math.floor(Math.random() * 1000000);
                const response = await chai.request(app)
                                            .put('/api/population/state/virginia/city/alexandria')
                                            .set('Content-Type', 'text/plain')
                                            .send(altPopulation.toString());
                const persistedPopulationData = JSON.parse(await readFile(path.join(path.resolve('./data'), process.env.CITY_POPULATION_JSON_FILENAME), { encoding: 'utf-8' }));

                response.should.have.status(200);
                response.should.to.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('population');
                response.body.population.should.be.equal(persistedPopulationData['Virginia']['Alexandria']);
            });
        });

        describe('Error', () => {
            it('400 - Invalid State params', async () => {
                const response = await chai.request(app)
                                            .put('/api/population/state/%20/city/Alexandria')
                                            .set('Content-Type', 'text/plain')
                                            .send(population.toString());

                response.should.have.status(400);
                response.should.to.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('error');
                response.body.error.should.be.equal('State parameter is invalid!');
            });

            it('400 - Invalid City params', async () => {
                const response = await chai.request(app)
                                            .put('/api/population/state/Virginia/city/%20')
                                            .set('Content-Type', 'text/plain')
                                            .send(population.toString());

                response.should.have.status(400);
                response.should.to.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('error');
                response.body.error.should.be.equal('City parameter is invalid!');
            });

            it('400 - Invalid Content Type', async () => {
                const response = await chai.request(app)
                                            .put('/api/population/state/Virginia/city/Alexandria')
                                            .set('Content-Type', 'application/json')
                                            .send(population.toString());

                response.should.have.status(400);
                response.should.to.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('error');
                response.body.error.should.be.equal('The body MIME type is invalid!');
            });

            it('400 - Invalid Body value', async () => {
                const response = await chai.request(app)
                                            .put('/api/population/state/Virginia/city/Alexandria')
                                            .set('Content-Type', 'text/plain')
                                            .send('HARAMBE!');

                response.should.have.status(400);
                response.should.to.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('error');
                response.body.error.should.be.equal('The population value is invalid!');
            });
        });
    });
});