const authMiddleware = require('../middleware/authMiddleware');
const AuthController = require('../controllers/AuthController');
const CourseController = require('../controllers/CourseController');
const LessonController = require('../controllers/LessonController');
const EnrollmentController = require('../controllers/EnrollmentController');
const PermissionController = require('../controllers/PermissionController');

const authRoutes = require('./authRoutes');
const courseRoutes = require('./courseRoutes');
const lessonRoutes = require('./lessonRoutes');
const enrollmentRoutes = require('./enrollmentRoutes');
const permissionRoutes = require('./permissionRoutes');

function routes(fastify, _opts, done) {
  const { services } = fastify.container;

  const controllers = {
    authController: new AuthController(services),
    courseController: new CourseController(services),
    lessonController: new LessonController(services),
    enrollmentController: new EnrollmentController(services),
    permissionController: new PermissionController(services)
  };

  fastify.register(authRoutes, { controllers });

  fastify.register(
    (securedFastify, __opts, securedDone) => {
      securedFastify.addHook('preHandler', authMiddleware);

      securedFastify.register(courseRoutes, { prefix: '/courses', controllers });
      securedFastify.register(lessonRoutes, { prefix: '/lessons', controllers });
      securedFastify.register(enrollmentRoutes, { prefix: '/enrollments', controllers });
      securedFastify.register(permissionRoutes, { prefix: '/permissions', controllers });

      securedDone();
    }
  );

  done();
}

module.exports = routes;
