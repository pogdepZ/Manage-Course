const AppError = require('../errors/AppError');

class CourseService {
  constructor({ courseRepository }) {
    this.courseRepository = courseRepository;
  }

  async create(subject, payload) {
    if (subject.role === 'student') {
      throw new AppError('Students cannot create courses', 403);
    }

    return this.courseRepository.create({
      title: payload.title,
      createdBy: subject.id
    });
  }

  async list(subject) {
    return this.courseRepository.findAllScoped(subject);
  }

  async getById(subject, courseId) {
    const course = await this.courseRepository.findByIdScoped(courseId, subject);
    if (!course) {
      throw new AppError('Course not found', 404);
    }
    return course;
  }

  async update(subject, courseId, payload) {
    const updated = await this.courseRepository.updateByIdScoped(courseId, payload, subject);
    if (!updated) {
      throw new AppError('Course not found or forbidden', 404);
    }
    return updated;
  }

  async remove(subject, courseId) {
    const deleted = await this.courseRepository.deleteByIdScoped(courseId, subject);
    if (!deleted) {
      throw new AppError('Course not found or forbidden', 404);
    }
    return deleted;
  }
}

module.exports = CourseService;
