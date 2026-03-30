const Course = require('../models/Course');
const { toObjectId } = require('../utils/objectId');
const { buildCourseScopeFilter } = require('../utils/dataScope');

class CourseRepository {
  constructor({ enrollmentRepository }) {
    this.enrollmentRepository = enrollmentRepository;
  }

  async create(payload) {
    return Course.create(payload);
  }

  async findById(id) {
    return Course.findById(id);
  }

  async findAllScoped(subject) {
    if (subject.role === 'teacher') {
      return Course.find({}).sort({ createdAt: -1 }).populate('createdBy', 'name').populate('teachers', 'name');
    }

    const scopeFilter = await buildCourseScopeFilter(subject, this.enrollmentRepository);
    return Course.find(scopeFilter).sort({ createdAt: -1 }).populate('createdBy', 'name').populate('teachers', 'name');
  }

  // Data scope is merged directly into MongoDB query to enforce row-level filtering.
  async findByIdScoped(id, subject) {
    const scopeFilter = await buildCourseScopeFilter(subject, this.enrollmentRepository);
    return Course.findOne({ _id: toObjectId(id), ...scopeFilter }).populate('createdBy', 'name').populate('teachers', 'name');
  }

  async updateByIdScoped(id, updates, subject) {
    const scopeFilter = await buildCourseScopeFilter(subject, this.enrollmentRepository);
    return Course.findOneAndUpdate({ _id: toObjectId(id), ...scopeFilter }, updates, {
      new: true,
      runValidators: true
    });
  }

  async deleteByIdScoped(id, subject) {
    const scopeFilter = await buildCourseScopeFilter(subject, this.enrollmentRepository);
    return Course.findOneAndDelete({ _id: toObjectId(id), ...scopeFilter });
  }
}

module.exports = CourseRepository;
