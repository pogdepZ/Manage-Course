const PolicyEngine = require('./policyEngine');

function buildPolicyEngine() {
  const policyEngine = new PolicyEngine();
  return policyEngine;
}

module.exports = {
  buildPolicyEngine
};
