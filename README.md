# U.S. City Population API

A Rest API written in Node.JS. Said API is meant to server population data by city for a given state in the United States. I wrote this API for a assignment for company I am interviewing with. The backend for this API is meant to be light on dependecies in order the best performance and throughtput possible.

## Objectives

In order for this assignment to be considered complete the following requirements for project must be met:

- Must use Node.JS version 18
- Written in plain Javascript (no typescript)
- Service must run on port 5555
- Service data must persist
- The service must include the API endpoint `/api/population/state/:state/city/:city` that utilizes both the `GET`, and the `PUT` method for HTTP requests
- The API endpoint above must take in the City and State for both `GET` and `PUT` requests as URL parameters
- The State and City parameters should also not be case-sensitive
- For HTTP requests using the `GET` method a response with the `400` status code should be returned. Along with a appropriate error message if the City / State combination cannot be found
- For HTTP requests using the `GET` method a response with `200` status code should returned along with the population number for the City / State combo provided
- For HTTP requests using the `PUT` method the body should be provided as the population number in a plain text format for the City / State combination provided
- For HTTP requests using the `PUT` method a response with the status code `200` should be returned if the city population is updated for a City / State combo that already exists
- For HTTP requests using the `PUT` method a response with the status code `201` should be returned if the city population is created for a City / State combo that does not exist

## Dependecies Used

For this project I opted not the use a web framework for implementing the backend for this REST API. For web server I am using the `http` module provided by Node.JS along with a handful of libraries that I would consider to be perfomant. The reason I went I decided to go with this route is because when compared to different Javascript web frameworks such as [Fastify](https://fastify.dev/), [Express.JS](https://expressjs.com/), and [HAPI](https://hapi.dev/), the generic HTTP module that Node.JS provides still has the better performance metrics when compared to said web frameworks. Benchmarks from the [Fastify benchmarks Repository](https://github.com/fastify/benchmarks/), [TechEmpower Web Framwork benchmarks](https://www.techempower.com/benchmarks/#section=data-r21&l=zik0sf-6bj&test=fortune), and the benchmarks performed by [Mark Choubey](https://medium.com/deno-the-complete-reference/the-hidden-cost-of-using-framework-fastify-vs-native-http-servers-in-node-js-17b364dfccfc) support these claims.

This projects implementes the following libraries:

- [find-my-way](https://github.com/delvedor/find-my-way) (HTTP router)
- [dotenv](https://www.npmjs.com/package/dotenv) (Environment variable loading)
- [Ajv](https://ajv.js.org/) (input validation)
- [node-cache](https://github.com/node-cache/node-cache) (Data caching)

## Test Cases

Even though providing unit tests for this assignment was not required, I have been trying to practice Test-Driven Development whenever working on projects that use plain Javascript or Typescript. I felt like this project would provide a decent challenge for implementing TDD. The Unit tests are created using [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com/). Furthermore, I have also adde script command `npm build` in `package.json` in order to providing a convenient way of running unit tests included in this project.

The current unit tests test for two things in project code:

- Reading/Writing JSON files for data persistance
- HTTP responses for different HTTP requests sent to `/api/population/state/:state/city/:city` endpoint

## Things I Could Improve On

While I feel pretty good about how this project turned out, there are some things I would have done differently if I were to deploy this API for production. As this project is for interview assignment and meant to light on dependecies there are things I do differently compared to how I would normally implementing certain pieces of functionality in Node.JS. Some of these things include:

- Using Redis for caching instead of using `node-cache`
- Persist the City / State data in a proper SQL database instead of storing said data in a JSON file.
- Spent extra time to for finding a solution for implementing middleware in order to simplify input validation (`find-my-way` does not have a way of implementing route middleware beyond middleware for bad urls and the default route)
- Implement a queue for write operations to where ever data ends up being persisted in order to minimize execution blocks during said write operations.

