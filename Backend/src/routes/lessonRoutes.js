const policyMiddleware = require('../middleware/policyMiddleware');

async function buildLessonPolicyResource(request) {
  const lesson = await request.server.container.repositories.lessonRepository.findById(request.params.lessonId);
  if (!lesson) {
    return null;
  }

  const course = await request.server.container.repositories.courseRepository.findById(lesson.courseId);
  if (!course) {
    return null;
  }

  return {
    lessonId: lesson._id,
    courseId: course._id,
    courseCreatedBy: course.createdBy
  };
}

function lessonRoutes(fastify, opts, done) {
  const { lessonController } = opts.controllers;

  fastify.get('/', {
    preHandler: [
      policyMiddleware({ resourceType: 'lesson', action: 'read' })
    ],
    handler: lessonController.list
  });

  fastify.get('/:lessonId', {
    preHandler: [
      policyMiddleware({
        resourceType: 'lesson',
        action: 'read',
        loadResource: buildLessonPolicyResource
      })
    ],
    handler: lessonController.getById
  });

  fastify.post('/', {
    preHandler: [
      policyMiddleware({
        resourceType: 'lesson',
        action: 'create',
        loadResource: async (request) => {
          const course = await request.server.container.repositories.courseRepository.findById(request.body.courseId);
          if (!course) {
            return null;
          }

          return {
            courseId: course._id,
            courseCreatedBy: course.createdBy
          };
        }
      })
    ],
    handler: lessonController.create
  });

  fastify.patch('/:lessonId', {
    preHandler: [
      policyMiddleware({
        resourceType: 'lesson',
        action: 'update',
        loadResource: buildLessonPolicyResource
      })
    ],
    handler: lessonController.update
  });

  fastify.delete('/:lessonId', {
    preHandler: [
      policyMiddleware({
        resourceType: 'lesson',
        action: 'delete',
        loadResource: buildLessonPolicyResource
      })
    ],
    handler: lessonController.remove
  });

  done();
}

module.exports = lessonRoutes;
