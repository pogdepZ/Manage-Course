import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { http } from '../api/http';
import { formatDate } from '../utils/helpers';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function fetchDashboardData() {
      setLoading(true);
      setError('');

      try {
        const [courseRes, lessonRes, enrollmentRes] = await Promise.all([
          http.get('/courses'),
          http.get('/lessons'),
          http.get('/enrollments')
        ]);

        if (!mounted) {
          return;
        }

        setCourses(courseRes.data?.data || courseRes.data || []);
        setLessons(lessonRes.data?.data || lessonRes.data || []);
        setEnrollments(enrollmentRes.data?.data || enrollmentRes.data || []);
      } catch (_error) {
        if (!mounted) {
          return;
        }
        setError('Khong tai duoc dashboard data. Vui long thu lai.');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchDashboardData();

    return () => {
      mounted = false;
    };
  }, []);

  const recentCourses = useMemo(() => courses.slice(0, 5), [courses]);

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Real-time data from backend with role-based scoping.</p>
        </div>
      </header>

      {error ? <p className="empty-state">{error}</p> : null}

      <div className="kpi-grid">
        <article className="kpi-card">
          <p>Courses</p>
          <h3>{loading ? '...' : courses.length}</h3>
        </article>
        <article className="kpi-card">
          <p>Lessons</p>
          <h3>{loading ? '...' : lessons.length}</h3>
        </article>
        <article className="kpi-card">
          <p>Enrollments</p>
          <h3>{loading ? '...' : enrollments.length}</h3>
        </article>
      </div>

      <section className="panel">
        <div className="panel-header">
          <h3>Recent Courses</h3>
          <Link to="/app/courses" className="text-link">
            Go to Courses
          </Link>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Owner</th>
                <th>Created Date</th>
                <th>Quick Action</th>
              </tr>
            </thead>
            <tbody>
              {recentCourses.map((course) => (
                <tr key={course._id || course.id}>
                  <td>{course.title}</td>
                  <td>{course.owner || course.createdBy || '-'}</td>
                  <td>{formatDate(course.createdAt)}</td>
                  <td>
                    <Link to={`/app/courses/${course._id || course.id}`} className="text-link">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {!loading && recentCourses.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <p className="empty-state">No courses available for your scope.</p>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
