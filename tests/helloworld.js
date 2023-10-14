import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.should();
chai.use(chaiHttp);

describe('Hello world API test', () => {
    it('Should return string "Hello World!"', (done) => {
        chai.request(app)
                .get('/api')
                .set('Content-type', 'text/plain')
                .end((_, response) => {
                    response.should.have.status(200);
                    response.should.to.be.text;
                    response.text.should.be.equal('Hello World!');
                    done();
                });
    });

    it('Should return "Hello <name>" when name is provided as a URL param', (done) => {
        chai.request(app)
                .get('/api/Stefan')
                .set('Content-type', 'text/plain')
                .end((_, response) => {
                    response.should.have.status(200);
                    response.should.to.be.text;
                    response.text.should.be.equal('Hello Stefan!');
                    done();
                });
    });
});