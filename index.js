require('dotenv').config();

const http = require('node:http');
const routes = require('./routes');

const server = http.createServer((request, response) => {
    routes.lookup(request, response);
});

server.listen(parseInt(process.env.PORT), () => {
    console.log(`REST API listening on port ${process.env.PORT}`);
});

module.exports = server;