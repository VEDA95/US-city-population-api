import dotenv from 'dotenv';

dotenv.config();

import http from 'node:http';
import routes from './routes/index.js';

const server = http.createServer((request, response) => {
    routes.lookup(request, response);
});

server.listen(parseInt(process.env.PORT), () => {
    console.log(`REST API listening on port ${process.env.PORT}`);
});

export default server;