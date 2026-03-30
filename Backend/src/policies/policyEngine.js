const fs = require('fs');
const path = require('path');

class PolicyEngine {
  constructor() {
    this.permissions = {};
    this.fullConfig = {};
    this.loadPermissions();
  }

  loadPermissions() {
    const filePath = path.join(__dirname, '../../role-permissions.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    this.fullConfig = data;
    this.permissions = data.roles;
  }

  getPermissions() {
    return this.fullConfig;
  }

  updatePermissions(newConfig) {
    const filePath = path.join(__dirname, '../../role-permissions.json');
    fs.writeFileSync(filePath, JSON.stringify(newConfig, null, 2), 'utf8');
    this.fullConfig = newConfig;
    this.permissions = newConfig.roles;
  }

  can({ subject, action, resourceType, resource }) {
    if (!subject || !subject.role) return false;
    
    // For reads: determine if it's a list (no resource) or detail (resource)
    let jsonAction = action;
    if (action === 'read') {
      jsonAction = resource ? 'read_detail' : 'read_list';
    }

    const rolePerms = this.permissions[subject.role];
    if (!rolePerms) return false;

    const resourcePerms = rolePerms[resourceType];
    if (!resourcePerms) return false;

    const actionPerm = resourcePerms[jsonAction];
    if (!actionPerm || !actionPerm.allowed) return false;

    // Evaluate dynamic JS condition from JSON if present
    if (actionPerm.condition) {
      if (!resource) return false; // Hard fail if condition relies on undefined resource

      try {
        // Creates a dynamic function interpreting the string condition:
        // func(subject, resource) => return expression;
        const evaluateCondition = new Function('subject', 'resource', `return ${actionPerm.condition};`);
        const result = evaluateCondition(subject, resource);
        return result === true;
      } catch (error) {
        console.error(`[PolicyEngine] Condition evaluation failed:`, error.message);
        return false;
      }
    }
    
    return true;
  }
}

module.exports = PolicyEngine;
