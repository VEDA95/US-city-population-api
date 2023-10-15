import findMyWay from 'find-my-way';
import helloWorld from './hello.js';
import population from './population.js';

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
router.get('/api/population/state/:state/city/:city', population.get);
router.put('/api/population/state/:state/city/:city', population.put);

export default router;