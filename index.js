import dotenv from 'dotenv';

dotenv.config();

import http from 'node:http';
import { existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import routes from './routes/index.js';
import { getData, setData } from './lib/cache.js';
import { readPopulationFile, writePopulationFile } from './lib/population_file.js';
import populationData from './data/city_population_obj.js';

const server = http.createServer(async (request, response) => {
    const { CITY_POPULATION_JSON_FILENAME } = process.env;
    const dataFilePath = join(resolve('./data'), CITY_POPULATION_JSON_FILENAME);
    let data;
    
    try {
        if(!existsSync(dataFilePath)) {
            data = {...populationData};
            await writePopulationFile(CITY_POPULATION_JSON_FILENAME, data);
    
        } else {
            data = await readPopulationFile(CITY_POPULATION_JSON_FILENAME);
        }

    } catch(err) {
        throw err;
    }

    for(const key of Object.keys(data)) {
        setData(key, data[key], false);
    }

    routes.lookup(request, response, { data: { getData, setData } });
});

server.listen(parseInt(process.env.PORT), async () => {
    console.log(`REST API listening on port ${process.env.PORT}`);
});

export default server;