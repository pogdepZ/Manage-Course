class LessonController {
  constructor({ lessonService }) {
    this.lessonService = lessonService;
  }

  create = async (request, reply) => {
    const lesson = await this.lessonService.create(request.user, request.body);
    reply.status(201).send(lesson);
  };

  list = async (request, reply) => {
    const lessons = await this.lessonService.list(request.user);
    reply.send(lessons);
  };

  getById = async (request, reply) => {
    const lesson = await this.lessonService.getById(request.user, request.params.lessonId);
    reply.send(lesson);
  };

  update = async (request, reply) => {
    const lesson = await this.lessonService.update(request.user, request.params.lessonId, request.body);
    reply.send(lesson);
  };

  remove = async (request, reply) => {
    await this.lessonService.remove(request.user, request.params.lessonId);
    reply.status(204).send();
  };
}

module.exports = LessonController;
