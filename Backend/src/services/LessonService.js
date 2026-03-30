const AppError = require('../errors/AppError');

class LessonService {
  constructor({ lessonRepository, courseRepository }) {
    this.lessonRepository = lessonRepository;
    this.courseRepository = courseRepository;
  }

  async create(subject, payload) {
    const course = await this.courseRepository.findByIdScoped(payload.courseId, subject);
    if (!course) {
      throw new AppError('Course not found or forbidden', 404);
    }

    if (subject.role === 'student') {
      throw new AppError('Students cannot create lessons', 403);
    }

    return this.lessonRepository.create({
      courseId: payload.courseId,
      content: payload.content
    });
  }

  async list(subject) {
    return this.lessonRepository.findAllScoped(subject);
  }

  async getById(subject, lessonId) {
    const lesson = await this.lessonRepository.findByIdScoped(lessonId, subject);
    if (!lesson) {
      throw new AppError('Lesson not found', 404);
    }
    return lesson;
  }

  async update(subject, lessonId, payload) {
    const updated = await this.lessonRepository.updateByIdScoped(lessonId, payload, subject);
    if (!updated) {
      throw new AppError('Lesson not found or forbidden', 404);
    }
    return updated;
  }

  async remove(subject, lessonId) {
    const deleted = await this.lessonRepository.deleteByIdScoped(lessonId, subject);
    if (!deleted) {
      throw new AppError('Lesson not found or forbidden', 404);
    }
    return deleted;
  }
}

module.exports = LessonService;
