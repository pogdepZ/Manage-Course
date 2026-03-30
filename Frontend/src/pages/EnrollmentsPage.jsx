import { useState } from 'react';
import { useToast } from '../stores/toastStore';
import { formatDate } from '../utils/helpers';
import { enrollmentList } from '../utils/mockData';

export default function EnrollmentsPage() {
  const toast = useToast();
  const [form, setForm] = useState({ userId: '', courseId: '' });
  const [pending, setPending] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPending(true);

    try {
      toast.success(`Enrollment submitted for ${form.userId} -> ${form.courseId}`);
      setForm({ userId: '', courseId: '' });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Enroll failed');
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
              {enrollmentList.map((item) => (
                <tr key={item.id}>
                  <td>{item.userId}</td>
                  <td>{item.courseId}</td>
                  <td>{formatDate(item.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
