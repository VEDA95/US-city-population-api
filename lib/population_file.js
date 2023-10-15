import { createReadStream } from 'node:fs';
import { resolve, join } from 'node:path';

function parseFilePath(name) {
    if(name == null || name?.length === 0) return '';
    if(!name.endsWith('.json')) name += '.json';

    return join(resolve('./data'), name);
}

export function readPopulationFile(name) {
    const filePath = parseFilePath(name);

    if(filePath.length === 0) return;

    const readStream = createReadStream(filePath);

    readStream.setEncoding('utf-8');

    return new Promise((resolve, reject) => {
        let data = '';

        readStream.on('data', (chunk) => {
            data += chunk;
        });
        readStream.on('error', (err) => reject(err));
        readStream.on('end', () => resolve(JSON.parse(data)));
    });
}

export async function writePopulationFile(name, data) {
}