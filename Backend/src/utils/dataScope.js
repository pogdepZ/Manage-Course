const { toObjectId } = require('./objectId');

async function buildCourseScopeFilter(subject, enrollmentRepository) {
  if (subject.role === 'admin') {
    return {};
  }

  if (subject.role === 'teacher') {
    return { $or: [{ createdBy: toObjectId(subject.id) }, { teachers: toObjectId(subject.id) }] };
  }

  if (subject.role === 'student') {
    const enrollments = await enrollmentRepository.findByUserId(subject.id);
    const courseIds = enrollments.map((enrollment) => enrollment.courseId);
    return { _id: { $in: courseIds } };
  }

  return { _id: { $in: [] } };
}

module.exports = {
  buildCourseScopeFilter
};
