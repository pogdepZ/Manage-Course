function registerCoursePolicies(policyEngine) {
  policyEngine.register({
    resourceType: 'course',
    actions: ['create', 'read', 'update', 'delete'],
    evaluate: ({ subject }) => subject.role === 'admin'
  });

  policyEngine.register({
    resourceType: 'course',
    actions: ['create'],
    evaluate: ({ subject }) => subject.role === 'teacher'
  });

  policyEngine.register({
    resourceType: 'course',
    actions: ['read'],
    evaluate: ({ subject, hasResource }) => subject.role === 'teacher' && !hasResource
  });

  policyEngine.register({
    resourceType: 'course',
    actions: ['read', 'update', 'delete'],
    evaluate: ({ subject, resource }) =>
      subject.role === 'teacher' &&
      resource &&
      (String(resource.createdBy) === String(subject.id) || (resource.teachers && resource.teachers.some(tId => String(tId) === String(subject.id))))
  });

  policyEngine.register({
    resourceType: 'course',
    actions: ['read'],
    evaluate: ({ subject }) => subject.role === 'student'
  });
}

module.exports = {
  registerCoursePolicies
};
