import findMyWay from 'find-my-way';
import helloWorld from './hello.js';

const router = findMyWay({
    ignoreTrailingSlash: true,
    defaultRoute: (_, response) => {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.write('The route provided could not be found!');
        response.end();
    }
});

router.get('/api/', helloWorld.get);
router.get('/api/:name', helloWorld.post);

export default router;