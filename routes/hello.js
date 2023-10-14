export default {
    get: (_, response) => {
        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.write('Hello World!');
        response.end();
    },
    post: (_, response, params) => {
        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.write(`Hello ${params.name}!`);
        response.end();
    }
};