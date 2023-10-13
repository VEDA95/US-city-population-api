const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const { expect } = chai;

chai.should();
chai.use(chaiHttp);

describe('Hello world API test', () => {
    it('Should return string "Hello World!"', (done) => {
        chai.request(app)
                .get('/')
                .set('Content-type', 'text/plain')
                .end((_, response) => {
                    response.should.have.status(200);
                    response.should.to.be.text;
                    response.text.should.be.equal('Hello World!');
                    done();
                });
    });
});