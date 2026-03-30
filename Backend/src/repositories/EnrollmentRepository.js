const Enrollment = require('../models/Enrollment');

class EnrollmentRepository {
  async create(payload) {
    return Enrollment.create(payload);
  }

  async findAll() {
    return Enrollment.find({}).sort({ createdAt: -1 });
  }

  async findByUserId(userId) {
    return Enrollment.find({ userId });
  }

  async findByCourseId(courseId) {
    return Enrollment.find({ courseId });
  }

  async findOneByUserAndCourse(userId, courseId) {
    return Enrollment.findOne({ userId, courseId });
  }
}

module.exports = EnrollmentRepository;
