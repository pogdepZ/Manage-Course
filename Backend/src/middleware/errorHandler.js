const AppError = require('../errors/AppError');

function errorHandler(error, _request, reply) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: error.message
    });
  }

  if (error.name === 'ValidationError') {
    return reply.status(400).send({
      error: error.message
    });
  }

  reply.log.error(error);
  return reply.status(500).send({
    error: 'Internal server error'
  });
}

module.exports = errorHandler;
