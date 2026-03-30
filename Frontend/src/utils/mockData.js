export const statsByRole = {
  admin: { courses: 32, lessons: 214, enrollments: 1489 },
  teacher: { courses: 7, lessons: 48, enrollments: 310 },
  student: { courses: 5, lessons: 21, enrollments: 5 },
};

export const courseList = [
  {
    id: 'c1',
    title: 'Intro to Node',
    owner: 'teacherA',
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-20T10:00:00.000Z',
  },
  {
    id: 'c2',
    title: 'MongoDB Foundation',
    owner: 'teacherB',
    createdAt: '2026-02-01T10:00:00.000Z',
    updatedAt: '2026-03-12T10:00:00.000Z',
  },
  {
    id: 'c3',
    title: 'REST API Design',
    owner: 'teacherA',
    createdAt: '2026-01-12T10:00:00.000Z',
    updatedAt: '2026-03-10T10:00:00.000Z',
  },
];

export const lessonList = [
  {
    id: 'l1',
    courseTitle: 'Intro to Node',
    preview: 'Runtime, modules, npm and event loop basics.',
  },
  {
    id: 'l2',
    courseTitle: 'MongoDB Foundation',
    preview: 'Collections, indexes, aggregation pipeline basics.',
  },
  {
    id: 'l3',
    courseTitle: 'REST API Design',
    preview: 'Status code strategy and resource modeling.',
  },
];

export const enrollmentList = [
  {
    id: 'e1',
    userId: 'u1001',
    courseId: 'c1',
    createdAt: '2026-03-15T08:30:00.000Z',
  },
  {
    id: 'e2',
    userId: 'u1002',
    courseId: 'c3',
    createdAt: '2026-03-18T12:00:00.000Z',
  },
];
