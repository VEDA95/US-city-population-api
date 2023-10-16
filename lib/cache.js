import NodeCache from 'node-cache';
import { writePopulationFile } from './population_file.js';

const cache = new NodeCache();

export function getData(key) {
    return cache.get(key);
}

export function setData(key, data, setFileData = true) {
    cache.set(key, data);

    if(setFileData) {
        const cacheData = cache.mget(cache.keys());

        writePopulationFile(process.env.CITY_POPULATION_JSON_FILENAME, cacheData).catch((err) => {
            throw err;
        });
    }
}