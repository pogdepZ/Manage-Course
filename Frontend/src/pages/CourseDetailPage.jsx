import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import RoleGate from '../components/RoleGate';
import { formatDate } from '../utils/helpers';
import { courseList, lessonList } from '../utils/mockData';

export default function CourseDetailPage() {
  const { courseId } = useParams();

  const course = useMemo(
    () => courseList.find((item) => item.id === courseId) || courseList[0],
    [courseId]
  );

  const courseLessons = lessonList.filter((lesson) => lesson.courseTitle === course?.title);

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <h2>Course: {course?.title}</h2>
          <p>Metadata, lessons and enrollment quick panel.</p>
        </div>
        <RoleGate allow={['admin', 'teacher']}>
          <div className="inline-actions">
            <button type="button">Edit</button>
            <button type="button" className="danger-button">
              Delete
            </button>
          </div>
        </RoleGate>
      </header>

      <section className="panel metadata-grid">
        <div>
          <p>Owner</p>
          <strong>{course?.owner}</strong>
        </div>
        <div>
          <p>Created At</p>
          <strong>{formatDate(course?.createdAt)}</strong>
        </div>
        <div>
          <p>Updated At</p>
          <strong>{formatDate(course?.updatedAt)}</strong>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>Lessons in this course</h3>
          <RoleGate allow={['admin', 'teacher']}>
            <button type="button" className="primary-button">
              + New Lesson
            </button>
          </RoleGate>
        </div>
        <div className="list-stack">
          {courseLessons.length === 0 ? (
            <p className="empty-state">No lesson in this course yet.</p>
          ) : (
            courseLessons.map((lesson) => (
              <article key={lesson.id} className="list-card">
                <h4>{lesson.courseTitle}</h4>
                <p>{lesson.preview}</p>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>Enrollment quick panel</h3>
          <button type="button" className="primary-button">
            Enroll User
          </button>
        </div>
      </section>
    </section>
  );
}
