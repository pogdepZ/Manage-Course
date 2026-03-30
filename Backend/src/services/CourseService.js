const AppError = require('../errors/AppError');

class CourseService {
  constructor(repositories) {
    this.courseRepository = repositories.courseRepository;
    this.userRepository = repositories.userRepository;
  }

  async create(subject, payload) {
    if (subject.role === 'student') {
      throw new AppError('Students cannot create courses', 403);
    }

    return this.courseRepository.create({
      title: payload.title,
      createdBy: subject.id,
      teachers: []
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
    const updates = {};

    if (typeof payload.title === 'string') {
      updates.title = payload.title;
    }

    if (Object.keys(updates).length === 0) {
      throw new AppError('No valid fields to update', 400);
    }

    const updated = await this.courseRepository.updateByIdScoped(courseId, updates, subject);
    if (!updated) {
      throw new AppError('Course not found or forbidden', 404);
    }
    return updated;
  }

  async addTeacher(subject, courseId, email) {
    const course = await this.courseRepository.findByIdScoped(courseId, subject);
    if (!course) {
      throw new AppError('Course not found or forbidden', 404);
    }
    
    if (!this.userRepository) throw new AppError('UserRepository not injected', 500);

    const newTeacher = await this.userRepository.findByEmail(email);
    if (!newTeacher || newTeacher.role !== 'teacher') {
      throw new AppError('Valid teacher email required', 400);
    }

    if (!course.teachers) course.teachers = [];
    if (!course.teachers.includes(newTeacher._id)) {
      course.teachers.push(newTeacher._id);
      await course.save();
    }

    return course;
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
