import { Link } from 'react-router-dom';
import { useAuth } from '../stores/authStore';
import { formatDate } from '../utils/helpers';
import { courseList, statsByRole } from '../utils/mockData';

export default function DashboardPage() {
  const { user } = useAuth();
  const role = user?.role || 'student';
  const stats = statsByRole[role] || statsByRole.student;

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>{role.toUpperCase()} view with role-based totals and recent courses.</p>
        </div>
      </header>

      <div className="kpi-grid">
        <article className="kpi-card">
          <p>Courses</p>
          <h3>{stats.courses}</h3>
        </article>
        <article className="kpi-card">
          <p>Lessons</p>
          <h3>{stats.lessons}</h3>
        </article>
        <article className="kpi-card">
          <p>Enrollments</p>
          <h3>{stats.enrollments}</h3>
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
              {courseList.map((course) => (
                <tr key={course.id}>
                  <td>{course.title}</td>
                  <td>{course.owner}</td>
                  <td>{formatDate(course.createdAt)}</td>
                  <td>
                    <Link to={`/app/courses/${course.id}`} className="text-link">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
