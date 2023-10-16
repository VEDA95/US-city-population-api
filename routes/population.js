import Ajv from 'ajv';

const ajv = new Ajv();
const paramSchema = {
    type: 'object',
    properties: {
        state: {
            type: 'string',
            minLength: 4,
            nullable: false
        },
        city: {
            type: 'string',
            minLength: 3,
            nullable: false
        }
    },
    required: ['state', 'city'],
    additionalProperties: false
};
const putBodySchema = {
    type: 'integer'
};
const paramValidator = ajv.compile(paramSchema);
const bodyValidator = ajv.compile(putBodySchema);

export default {
    get(_, response, params) {
        const paramsValid = paramValidator(params);

        if(!paramsValid) {
            const err = paramValidator.errors[0];
            let errMessage = '';

            if(err.instancePath === '/state') errMessage = 'State parameter is invalid!';
            if(err.instancePath === '/city') errMessage = 'City parameter is invalid!';

            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify({error: errMessage}));
            response.end();
            return;
        }

        const { state, city } = params;
        const cities = this.data.getData(state);
        const population = cities != null ? cities[city] : null;

        if(cities == null || (cities != null && population == null)) {
            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify({error: 'State or City could not be found!'}));
            response.end();
            return;
        }

        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify({population: population}));
        response.end();
    },
    put(_, response, params) {
        response.end();
    }
};