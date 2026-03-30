import { useEffect, useState } from 'react';
import { http } from '../api/http';
import { useToast } from '../stores/toastStore';
import { extractErrorMessage, formatDate } from '../utils/helpers';

export default function EnrollmentsPage() {
  const toast = useToast();
  const [form, setForm] = useState({ userId: '', courseId: '' });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const response = await http.get('/enrollments');
      setItems(response.data?.data || response.data || []);
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Load enrollments failed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPending(true);

    try {
      await http.post('/enrollments', form);
      toast.success(`Enrollment submitted for ${form.userId} -> ${form.courseId}`);
      setForm({ userId: '', courseId: '' });
      fetchEnrollments();
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Enroll failed'));
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <h2>Enrollments</h2>
          <p>Create enrollment quickly and monitor records.</p>
        </div>
      </header>

      <section className="panel">
        <form className="inline-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="userId"
            value={form.userId}
            onChange={handleChange}
            required
            placeholder="UserId"
          />
          <input
            type="text"
            name="courseId"
            value={form.courseId}
            onChange={handleChange}
            required
            placeholder="CourseId"
          />
          <button type="submit" className="primary-button" disabled={pending}>
            {pending ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>UserId</th>
                <th>CourseId</th>
                <th>CreatedAt</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id || item.id}>
                  <td>{item.userId}</td>
                  <td>{item.courseId}</td>
                  <td>{formatDate(item.createdAt)}</td>
                </tr>
              ))}
              {!loading && items.length === 0 ? (
                <tr>
                  <td colSpan={3}>
                    <p className="empty-state">No enrollments found for your scope.</p>
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
