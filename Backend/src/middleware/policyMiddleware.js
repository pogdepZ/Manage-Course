const AppError = require('../errors/AppError');

function policyMiddleware({ resourceType, action, loadResource }) {
  return async function checkPolicy(request, _reply) {
    const subject = request.user;
    const { policyEngine } = request.server.container;

    let resource = null;
    if (loadResource) {
      resource = await loadResource(request);
    }

    const allowed = policyEngine.can({
      subject,
      action,
      resourceType,
      resource
    });

    if (!allowed) {
      throw new AppError('Forbidden', 403);
    }
  };
}

module.exports = policyMiddleware;
