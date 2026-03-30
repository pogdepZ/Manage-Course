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

  // Example ABAC rule: teacher can update only own courses.
  policyEngine.register({
    resourceType: 'course',
    actions: ['read', 'update', 'delete'],
    evaluate: ({ subject, resource }) =>
      subject.role === 'teacher' &&
      resource &&
      String(resource.createdBy) === String(subject.id)
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
