import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { http } from '../api/http';
import RoleGate from '../components/RoleGate';
import { extractErrorMessage, formatDate } from '../utils/helpers';

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [courseLessons, setCourseLessons] = useState([]);
  const [requestError, setRequestError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      setLoading(true);
      setRequestError('');

      try {
        const courseResponse = await http.get(`/courses/${courseId}`);
        const nextCourse = courseResponse.data?.data || courseResponse.data;

        if (!mounted) {
          return;
        }

        setCourse(nextCourse);

        const lessonsResponse = await http.get('/lessons');
        const lessons = lessonsResponse.data?.data || lessonsResponse.data || [];

        if (!mounted) {
          return;
        }

        const filteredLessons = lessons.filter(
          (lesson) => String(lesson.courseId) === String(nextCourse?._id || nextCourse?.id)
        );
        setCourseLessons(filteredLessons);
      } catch (error) {
        if (!mounted) {
          return;
        }

        const status = error?.response?.status;

        if (status === 403) {
          setRequestError('Khong du quyen de xem chi tiet khoa hoc nay.');
        } else if (status === 404) {
          setRequestError('Khong tim thay khoa hoc.');
        } else {
          setRequestError(extractErrorMessage(error, 'Tai du lieu that bai.'));
        }

        setCourse(null);
        setCourseLessons([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [courseId]);

  if (loading) {
    return (
      <section className="page-stack">
        <header className="page-header">
          <div>
            <h2>Course Detail</h2>
            <p>Dang tai du lieu...</p>
          </div>
        </header>
      </section>
    );
  }

  if (requestError) {
    return (
      <section className="page-stack">
        <header className="page-header">
          <div>
            <h2>Course Detail</h2>
            <p>Kiem tra quyen truy cap truoc khi thao tac.</p>
          </div>
        </header>

        <section className="panel">
          <p className="empty-state">{requestError}</p>
        </section>
      </section>
    );
  }

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
          <strong>{course?.owner || course?.createdBy || '-'}</strong>
        </div>
        <div>
          <p>Created At</p>
          <strong>{course?.createdAt ? formatDate(course.createdAt) : '-'}</strong>
        </div>
        <div>
          <p>Updated At</p>
          <strong>{course?.updatedAt ? formatDate(course.updatedAt) : '-'}</strong>
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
              <article key={lesson._id || lesson.id} className="list-card">
                <h4>Lesson #{lesson._id || lesson.id}</h4>
                <p>{lesson.content || lesson.preview}</p>
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
