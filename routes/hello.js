module.exports = {
    get: (_, response) => {
        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.write('Hello World!');
        response.end();
    }
};