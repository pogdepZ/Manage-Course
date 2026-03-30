const UserRepository = require('./repositories/UserRepository');
const RefreshTokenRepository = require('./repositories/RefreshTokenRepository');
const CourseRepository = require('./repositories/CourseRepository');
const LessonRepository = require('./repositories/LessonRepository');
const EnrollmentRepository = require('./repositories/EnrollmentRepository');

const AuthService = require('./services/AuthService');
const CourseService = require('./services/CourseService');
const LessonService = require('./services/LessonService');
const EnrollmentService = require('./services/EnrollmentService');

const { buildPolicyEngine } = require('./policies');

function buildContainer() {
  const repositories = {
    userRepository: new UserRepository(),
    refreshTokenRepository: new RefreshTokenRepository(),
    enrollmentRepository: new EnrollmentRepository()
  };

  repositories.courseRepository = new CourseRepository({
    enrollmentRepository: repositories.enrollmentRepository
  });

  repositories.lessonRepository = new LessonRepository({
    enrollmentRepository: repositories.enrollmentRepository
  });

  const services = {
    authService: new AuthService(repositories),
    courseService: new CourseService(repositories),
    lessonService: new LessonService(repositories),
    enrollmentService: new EnrollmentService(repositories)
  };

  return {
    repositories,
    services,
    policyEngine: buildPolicyEngine()
  };
}

module.exports = {
  buildContainer
};
