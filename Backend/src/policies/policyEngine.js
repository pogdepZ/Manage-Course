class PolicyEngine {
  constructor() {
    this.policies = [];
  }

  register(policy) {
    this.policies.push(policy);
  }

  can({ subject, action, resourceType, resource }) {
    for (const policy of this.policies) {
      const applies = policy.resourceType === resourceType && policy.actions.includes(action);
      if (!applies) {
        continue;
      }

      const allowed = policy.evaluate({ subject, action, resource });
      if (allowed) {
        return true;
      }
    }

    return false;
  }
}

module.exports = PolicyEngine;
