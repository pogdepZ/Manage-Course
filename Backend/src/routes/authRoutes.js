function authRoutes(fastify, opts, done) {
  const { authController } = opts.controllers;

  fastify.post('/register', authController.register);
  fastify.post('/login', authController.login);
  fastify.post('/refresh', authController.refresh);

  done();
}

module.exports = authRoutes;
