const Lesson = require('../models/Lesson');
const { toObjectId } = require('../utils/objectId');
const { buildCourseScopeFilter } = require('../utils/dataScope');
const Course = require('../models/Course');

class LessonRepository {
  constructor({ enrollmentRepository }) {
    this.enrollmentRepository = enrollmentRepository;
  }

  async create(payload) {
    return Lesson.create(payload);
  }

  async findById(id) {
    return Lesson.findById(id);
  }

  async findAllScoped(subject) {
    const courseScope = await buildCourseScopeFilter(subject, this.enrollmentRepository);
    const courses = await Course.find(courseScope).select({ _id: 1 });
    const courseIds = courses.map((course) => course._id);

    return Lesson.find({ courseId: { $in: courseIds } }).sort({ createdAt: -1 });
  }

  async findByIdScoped(id, subject) {
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return null;
    }

    const courseScope = await buildCourseScopeFilter(subject, this.enrollmentRepository);
    const course = await Course.findOne({ _id: lesson.courseId, ...courseScope }).select({ _id: 1 });
    if (!course) {
      return null;
    }

    return lesson;
  }

  async updateByIdScoped(id, updates, subject) {
    const lesson = await this.findByIdScoped(id, subject);
    if (!lesson) {
      return null;
    }

    return Lesson.findOneAndUpdate({ _id: toObjectId(id) }, updates, {
      new: true,
      runValidators: true
    });
  }

  async deleteByIdScoped(id, subject) {
    const lesson = await this.findByIdScoped(id, subject);
    if (!lesson) {
      return null;
    }

    return Lesson.findOneAndDelete({ _id: toObjectId(id) });
  }
}

module.exports = LessonRepository;
