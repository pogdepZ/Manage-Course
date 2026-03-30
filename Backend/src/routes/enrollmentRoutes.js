const policyMiddleware = require('../middleware/policyMiddleware');

function enrollmentRoutes(fastify, opts, done) {
  const { enrollmentController } = opts.controllers;

  const enrollRouteOptions = {
    preHandler: [
      policyMiddleware({
        resourceType: 'enrollment',
        action: 'create',
        loadResource: async (request) => {
          const course = await request.server.container.repositories.courseRepository.findById(request.body.courseId);
          if (!course) {
            return {
              userId: request.body.userId,
              courseId: request.body.courseId,
              courseCreatedBy: null
            };
          }
          return {
            userId: request.body.userId,
            courseId: request.body.courseId,
            courseCreatedBy: course.createdBy,
            courseTeachers: course.teachers
          };
        }
      })
    ],
    handler: enrollmentController.enroll
  };

  // RESTful create endpoint aligned with role-permissions map.
  fastify.post('/', enrollRouteOptions);

  // Backward compatible alias for existing clients.
  fastify.post('/enroll', enrollRouteOptions);

  fastify.get('/', {
    preHandler: [
      policyMiddleware({ resourceType: 'enrollment', action: 'read' })
    ],
    handler: enrollmentController.list
  });

  done();
}

module.exports = enrollmentRoutes;
