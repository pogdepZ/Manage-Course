class AuthController {
  constructor({ authService }) {
    this.authService = authService;
  }

  register = async (request, reply) => {
    const result = await this.authService.register(request.body);
    reply.status(201).send(result);
  };

  login = async (request, reply) => {
    const result = await this.authService.login(request.body);
    reply.send(result);
  };

  refresh = async (request, reply) => {
    const result = await this.authService.refresh(request.body);
    reply.send(result);
  };
}

module.exports = AuthController;
