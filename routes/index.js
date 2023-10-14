const router = require('find-my-way')({
    ignoreTrailingSlash: true,
    defaultRoute: (_, response) => {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.write('The route provided could not be found!');
        response.end();
    }
});
const helloWorld = require('./hello');

router.get('/api/', helloWorld.get);

module.exports = router;