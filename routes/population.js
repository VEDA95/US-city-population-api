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
    type: 'integer',
    nullable: false
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
            response.write(JSON.stringify({ error: errMessage }));
            response.end();
            return;
        }

        let { state, city } = params;
        state = `${state.charAt(0).toUpperCase()}${state.slice(1)}`;
        city = `${city.charAt(0).toUpperCase()}${city.slice(1)}`;
        const cities = this.data.getData(state);
        const population = cities != null ? cities[city] : null;

        if(cities == null || (cities != null && population == null)) {
            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify({ error: 'State or City could not be found!' }));
            response.end();
            return;
        }

        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify({ population: population }));
        response.end();
    },
    put(request, response, params) {
        if(request.headers['content-type'] !== 'text/plain') {
            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify({ error: 'The body MIME type is invalid!' }));
            response.end();
            return;
        }

        let body = '';

        request.on('data', (chunk) => {
            body += chunk.toString();
        });

        request.on('end', () => {
            const bodyInt = parseInt(body);
            const paramsValid = paramValidator(params);
            const bodyValid = bodyValidator(bodyInt);

            if(!paramsValid || !bodyValid) {
                let errMessage = '';

                if(paramValidator.errors != null && paramValidator.errors.length > 0) {
                    const paramErr = paramValidator.errors[0];

                    if(paramErr.instancePath === '/state') errMessage = 'State parameter is invalid!';
                    if(paramErr.instancePath === '/city') errMessage = 'City parameter is invalid!';

                } else {
                    errMessage = 'The population value is invalid!';

                }

                response.writeHead(400, { 'Content-Type': 'application/json' });
                response.write(JSON.stringify({ error: errMessage }));
                response.end();
                return;

            }

            let { state, city } = params;
            state = `${state.charAt(0).toUpperCase()}${state.slice(1)}`;
            city = `${city.charAt(0).toUpperCase()}${city.slice(1)}`;
            const cities = this.data.getData(state);
            const population = cities != null ? cities[city] : null;

            if(cities == null || (cities != null && population == null)) {
                const newData = cities != null ? { ...cities, [city]: bodyInt } : { [city]: bodyInt };

                this.data.setData(state, newData)
                    .then(() => {
                        response.writeHead(201, { 'Content-Type': 'application/json' });
                        response.write(JSON.stringify({ population: bodyInt }));
                        response.end();

                    })
                    .catch((err) => {
                        response.end();
                        throw err;
                    });

                return;
            }

            this.data.setData(state, { ...cities, [city]: bodyInt })
                .then(() => {
                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    response.write(JSON.stringify({ population: bodyInt }));
                    response.end();
                })
                .catch((err) => {
                    response.end();
                    throw err;
                });
        });
    }
};