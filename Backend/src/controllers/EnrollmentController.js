class EnrollmentController {
  constructor({ enrollmentService }) {
    this.enrollmentService = enrollmentService;
  }

  enroll = async (request, reply) => {
    const enrollment = await this.enrollmentService.enroll(request.user, request.body);
    reply.status(201).send(enrollment);
  };

  list = async (request, reply) => {
    const enrollments = await this.enrollmentService.list(request.user);
    reply.send(enrollments);
  };
}

module.exports = EnrollmentController;
