import { deepEqual } from 'assert';
import { writeFile, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { readPopulationFile, writePopulationFile } from '../lib/population_file.js';
import populationData from '../data/city_population_obj.js';

describe('Reading and Writing Population data to JSON file', () => {
    const relativateDataPath = resolve('./data');
    const testFileNameRead = 'test_population_read.json';
    const testFileNameWrite = 'test_population_write.json';
    const testPathRead = join(relativateDataPath, testFileNameRead);
    const testPathWrite = join(relativateDataPath, testFileNameWrite);

    before(async () => {
        await writeFile(testPathRead, JSON.stringify(populationData), { encoding: 'utf-8' });
    });
    
    it('Reading Population Data from JSON file', async () => {
        const populationDataRead = await readPopulationFile(testFileNameRead);

        deepEqual(populationDataRead, populationData);
    });
    
    it('Writing Population Data to JSON file', async () => {
        await writePopulationFile(testFileNameWrite, populationData);

        const populationDataWrite = JSON.parse(await readFile(testPathWrite, { encoding: 'utf-8' }));

        deepEqual(populationDataWrite, populationData);
    });

    after(async () => {
        if(existsSync(testPathRead)) await rm(testPathRead);
        if(existsSync(testPathWrite)) await rm(testPathWrite);
    });
});