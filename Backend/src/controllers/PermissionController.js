class PermissionController {
    constructor(services) {
        this.services = services;
    }

    getPermissions = async (request, reply) => {
        const { policyEngine } = request.server.container;
        const permissions = policyEngine.getPermissions();
        return reply.send({
            success: true,
            data: permissions
        });
    };

    updatePermissions = async (request, reply) => {
        const { policyEngine } = request.server.container;
        const { config } = request.body;

        if (!config || !config.roles) {
            return reply.code(400).send({
                success: false,
                message: 'Invalid permission configuration format'
            });
        }

        policyEngine.updatePermissions(config);

        return reply.send({
            success: true,
            message: 'Permissions updated successfully',
            data: policyEngine.getPermissions()
        });
    };
}

module.exports = PermissionController;
