const PolicyEngine = require('./policyEngine');
const { registerCoursePolicies } = require('./coursePolicies');
const { registerLessonPolicies } = require('./lessonPolicies');
const { registerEnrollmentPolicies } = require('./enrollmentPolicies');

function buildPolicyEngine() {
  const policyEngine = new PolicyEngine();

  registerCoursePolicies(policyEngine);
  registerLessonPolicies(policyEngine);
  registerEnrollmentPolicies(policyEngine);

  return policyEngine;
}

module.exports = {
  buildPolicyEngine
};
