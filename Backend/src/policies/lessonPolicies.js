function registerLessonPolicies(policyEngine) {
  policyEngine.register({
    resourceType: 'lesson',
    actions: ['create', 'read', 'update', 'delete'],
    evaluate: ({ subject }) => subject.role === 'admin'
  });

  policyEngine.register({
    resourceType: 'lesson',
    actions: ['create', 'read', 'update', 'delete'],
    evaluate: ({ subject, resource }) =>
      subject.role === 'teacher' &&
      resource &&
      String(resource.courseCreatedBy) === String(subject.id)
  });

  policyEngine.register({
    resourceType: 'lesson',
    actions: ['read'],
    evaluate: ({ subject, hasResource }) => subject.role === 'teacher' && !hasResource
  });

  policyEngine.register({
    resourceType: 'lesson',
    actions: ['read'],
    evaluate: ({ subject }) => subject.role === 'student'
  });
}

module.exports = {
  registerLessonPolicies
};
