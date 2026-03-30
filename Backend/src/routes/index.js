const authMiddleware = require('../middleware/authMiddleware');
const AuthController = require('../controllers/AuthController');
const CourseController = require('../controllers/CourseController');
const LessonController = require('../controllers/LessonController');
const EnrollmentController = require('../controllers/EnrollmentController');

const authRoutes = require('./authRoutes');
const courseRoutes = require('./courseRoutes');
const lessonRoutes = require('./lessonRoutes');
const enrollmentRoutes = require('./enrollmentRoutes');

function routes(fastify, _opts, done) {
  const { services } = fastify.container;

  const controllers = {
    authController: new AuthController(services),
    courseController: new CourseController(services),
    lessonController: new LessonController(services),
    enrollmentController: new EnrollmentController(services)
  };

  fastify.register(authRoutes, { controllers });

  fastify.register(
    (securedFastify, __opts, securedDone) => {
      securedFastify.addHook('preHandler', authMiddleware);

      securedFastify.register(courseRoutes, { prefix: '/courses', controllers });
      securedFastify.register(lessonRoutes, { prefix: '/lessons', controllers });
      securedFastify.register(enrollmentRoutes, { prefix: '/enrollments', controllers });

      securedDone();
    }
  );

  done();
}

module.exports = routes;
