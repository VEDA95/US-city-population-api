import NodeCache from 'node-cache';
import { readPopulationFile, writePopulationFile } from './population_file.js';

const cache = new NodeCache();

export async function getData(key) {
    const data = cache.get(key);

    if(data == null) {
        const fileData = await readPopulationFile(process.env.CITY_POPULATION_JSON_FILENAME);

        cache.set(key, fileData);

        return fileData[key];
    }

    return data;
}

export function setData(key, data, setFileData = true) {
    cache.set(key, data);

    if(setFileData) {
        const cacheData = cache.mget(cache.keys());

        writePopulationFile(process.env.CITY_POPULATION_JSON_FILENAME, cacheData);
    }
}