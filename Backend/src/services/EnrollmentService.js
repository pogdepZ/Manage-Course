const AppError = require('../errors/AppError');

class EnrollmentService {
  constructor({ enrollmentRepository, courseRepository }) {
    this.enrollmentRepository = enrollmentRepository;
    this.courseRepository = courseRepository;
  }

  async enroll(subject, payload) {
    if (subject.role === 'teacher') {
      const ownedCourse = await this.courseRepository.findByIdScoped(payload.courseId, subject);
      if (!ownedCourse) {
        throw new AppError('Course not found or forbidden', 404);
      }
    }

    if (subject.role === 'student' && String(payload.userId) !== String(subject.id)) {
      throw new AppError('Students can only enroll themselves', 403);
    }

    const existing = await this.enrollmentRepository.findOneByUserAndCourse(payload.userId, payload.courseId);
    if (existing) {
      throw new AppError('Already enrolled', 409);
    }

    return this.enrollmentRepository.create(payload);
  }

  async list(subject) {
    if (subject.role === 'admin') {
      return this.enrollmentRepository.findAll();
    }

    if (subject.role === 'teacher') {
      const courses = await this.courseRepository.findOwnedCourses(subject);
      const rows = await Promise.all(courses.map((course) => this.enrollmentRepository.findByCourseId(course._id)));
      return rows.flat();
    }

    return this.enrollmentRepository.findByUserId(subject.id);
  }
}

module.exports = EnrollmentService;
