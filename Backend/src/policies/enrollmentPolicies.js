function registerEnrollmentPolicies(policyEngine) {
  policyEngine.register({
    resourceType: 'enrollment',
    actions: ['create', 'read'],
    evaluate: ({ subject }) => subject.role === 'admin'
  });

  policyEngine.register({
    resourceType: 'enrollment',
    actions: ['create', 'read'],
    evaluate: ({ subject, resource }) =>
      subject.role === 'teacher' &&
      resource &&
      String(resource.courseCreatedBy) === String(subject.id)
  });

  policyEngine.register({
    resourceType: 'enrollment',
    actions: ['read'],
    evaluate: ({ subject, hasResource }) => subject.role === 'teacher' && !hasResource
  });

  policyEngine.register({
    resourceType: 'enrollment',
    actions: ['create'],
    evaluate: ({ subject, resource }) =>
      subject.role === 'student' &&
      resource &&
      String(resource.userId) === String(subject.id)
  });

  policyEngine.register({
    resourceType: 'enrollment',
    actions: ['read'],
    evaluate: ({ subject }) => subject.role === 'student'
  });
}

module.exports = {
  registerEnrollmentPolicies
};
