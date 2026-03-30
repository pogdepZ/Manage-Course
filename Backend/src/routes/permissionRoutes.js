async function permissionRoutes(fastify, options) {
    const { permissionController } = options.controllers;

    // Add a hook to ensure only admins can access these routes
    fastify.addHook('preHandler', async (request, reply) => {
        if (request.user.role !== 'admin') {
            return reply.code(403).send({
                success: false,
                message: 'Forbidden: Admin access required'
            });
        }
    });

    fastify.get('/', permissionController.getPermissions);
    fastify.put('/', permissionController.updatePermissions);
}

module.exports = permissionRoutes;
