const Fastify = require('fastify');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { buildContainer } = require('./container');

function buildApp() {
  const app = Fastify({
    logger: true
  });

  app.decorate('container', buildContainer());

  app.setErrorHandler(errorHandler);

  app.register(routes, { prefix: '/api' });

  app.get('/health', async () => ({ status: 'ok' }));

  return app;
}

module.exports = buildApp;
