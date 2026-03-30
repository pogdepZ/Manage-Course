import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import RoleGate from '../components/RoleGate';
import { useAuth } from '../stores/authStore';
import { useToast } from '../stores/toastStore';
import { formatDate } from '../utils/helpers';
import { courseList } from '../utils/mockData';

export default function CoursesPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [keyword, setKeyword] = useState('');
  const [owner, setOwner] = useState('all');
  const [loadingAction, setLoadingAction] = useState(false);

  const owners = useMemo(() => ['all', ...new Set(courseList.map((course) => course.owner))], []);

  const filtered = useMemo(
    () =>
      courseList.filter((course) => {
        const matchedKeyword = course.title.toLowerCase().includes(keyword.toLowerCase());
        const matchedOwner = owner === 'all' || course.owner === owner;
        return matchedKeyword && matchedOwner;
      }),
    [keyword, owner]
  );

  const handleDelete = async (courseId) => {
    if (!window.confirm('Delete this course?')) {
      return;
    }

    setLoadingAction(true);
    try {
      toast.success(`Deleted course ${courseId} (UI demo action).`);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Delete failed');
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <h2>Courses</h2>
          <p>Search, filter and perform CRUD actions. UI still respects backend 403 responses.</p>
        </div>
        <RoleGate allow={['admin', 'teacher']}>
          <button type="button" className="primary-button">
            + New Course
          </button>
        </RoleGate>
      </header>

      <section className="panel">
        <div className="filter-row">
          <input
            type="search"
            placeholder="Search title"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <select value={owner} onChange={(event) => setOwner(event.target.value)}>
            {owners.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="ghost-button"
            onClick={() => {
              setKeyword('');
              setOwner('all');
            }}
          >
            Reset
          </button>
        </div>

        {filtered.length === 0 ? (
          <p className="empty-state">No courses found for current filters.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Created By</th>
                  <th>Updated At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((course) => (
                  <tr key={course.id}>
                    <td>{course.title}</td>
                    <td>{course.owner}</td>
                    <td>{formatDate(course.updatedAt)}</td>
                    <td className="action-cell">
                      <Link to={`/app/courses/${course.id}`} className="text-link">
                        View
                      </Link>
                      <RoleGate allow={['admin', 'teacher']}>
                        <button type="button" disabled={loadingAction}>
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={loadingAction || user?.role === 'student'}
                          onClick={() => handleDelete(course.id)}
                        >
                          Delete
                        </button>
                      </RoleGate>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}
