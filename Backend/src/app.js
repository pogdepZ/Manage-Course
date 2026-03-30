const Fastify = require('fastify');
const cors = require('@fastify/cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { buildContainer } = require('./container');

function buildApp() {
  const app = Fastify({
    logger: true
  });

  app.register(cors, {
    origin: true // Allow typical origins or specify frontend URL
  });

  app.decorate('container', buildContainer());

  app.setErrorHandler(errorHandler);

  app.register(routes, { prefix: '/api' });

  app.get('/health', async () => ({ status: 'ok' }));

  return app;
}

module.exports = buildApp;
