class CourseController {
  constructor({ courseService }) {
    this.courseService = courseService;
  }

  create = async (request, reply) => {
    const course = await this.courseService.create(request.user, request.body);
    reply.status(201).send(course);
  };

  list = async (request, reply) => {
    const courses = await this.courseService.list(request.user);
    reply.send(courses);
  };

  getById = async (request, reply) => {
    const course = await this.courseService.getById(request.user, request.params.courseId);
    reply.send(course);
  };

  update = async (request, reply) => {
    const course = await this.courseService.update(request.user, request.params.courseId, request.body);
    reply.send(course);
  };

  remove = async (request, reply) => {
    await this.courseService.remove(request.user, request.params.courseId);
    reply.status(204).send();
  };
}

module.exports = CourseController;
