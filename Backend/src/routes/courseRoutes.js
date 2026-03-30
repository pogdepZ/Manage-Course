const policyMiddleware = require('../middleware/policyMiddleware');

function courseRoutes(fastify, opts, done) {
  const { courseController } = opts.controllers;

  fastify.get('/', {
    preHandler: [
      policyMiddleware({ resourceType: 'course', action: 'read' })
    ],
    handler: courseController.list
  });

  fastify.get('/:courseId', {
    preHandler: [
      policyMiddleware({
        resourceType: 'course',
        action: 'read',
        loadResource: async (request) => {
          return request.server.container.repositories.courseRepository.findById(request.params.courseId);
        }
      })
    ],
    handler: courseController.getById
  });

  fastify.post('/', {
    preHandler: [
      policyMiddleware({ resourceType: 'course', action: 'create' })
    ],
    handler: courseController.create
  });

  fastify.patch('/:courseId', {
    preHandler: [
      policyMiddleware({
        resourceType: 'course',
        action: 'update',
        loadResource: async (request) => {
          return request.server.container.repositories.courseRepository.findById(request.params.courseId);
        }
      })
    ],
    handler: courseController.update
  });

  fastify.delete('/:courseId', {
    preHandler: [
      policyMiddleware({
        resourceType: 'course',
        action: 'delete',
        loadResource: async (request) => {
          return request.server.container.repositories.courseRepository.findById(request.params.courseId);
        }
      })
    ],
    handler: courseController.remove
  });

  done();
}

module.exports = courseRoutes;
