import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import RoleGate from '../components/RoleGate';
import { useAuth } from '../stores/authStore';
import { useToast } from '../stores/toastStore';
import { formatDate } from '../utils/helpers';
import { http } from '../api/http';

export default function CoursesPage() {
  const { user } = useAuth();
  const toast = useToast();
  
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  
  const [keyword, setKeyword] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '' });

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data } = await http.get('/courses');
      setCourses(data?.data || data || []);
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filtered = useMemo(
    () => courses.filter(course => course.title?.toLowerCase().includes(keyword.toLowerCase())),
    [courses, keyword]
  );

  const openForm = (course = null) => {
    setIsModalOpen(true);
    if (course) {
      setEditingId(course._id || course.id);
      setFormData({ title: course.title });
    } else {
      setEditingId(null);
      setFormData({ title: '' });
    }
  };

  const closeForm = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ title: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return toast.error('Title is required');
    
    setLoadingAction(true);
    try {
      if (editingId) {
        await http.patch(`/courses/${editingId}`, formData);
        toast.success('Course updated successfully');
      } else {
        await http.post('/courses', formData);
        toast.success('Course created successfully');
      }
      closeForm();
      fetchCourses();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Action failed');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }
    setLoadingAction(true);
    try {
      await http.delete(`/courses/${courseId}`);
      toast.success('Course deleted!');
      fetchCourses();
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
          <h2>Courses Management</h2>
          <p>Search, create, update, and delete courses dynamically.</p>
        </div>
        <RoleGate allow={['admin', 'teacher']}>
          <button type="button" className="primary-button" onClick={() => openForm(null)}>
            + New Course
          </button>
        </RoleGate>
      </header>

      <section className="panel">
        <div className="filter-row">
          <input
            type="search"
            placeholder="Search by title..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="button" className="ghost-button" onClick={() => setKeyword('')}>
            Reset Search
          </button>
        </div>

        {loading ? (
          <p className="empty-state">Loading courses...</p>
        ) : filtered.length === 0 ? (
          <p className="empty-state">No courses found matching your criteria.</p>
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
                  <tr key={course._id || course.id}>
                    <td><strong>{course.title}</strong></td>
                    <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{course.createdBy}</td>
                    <td>{formatDate(course.updatedAt)}</td>
                    <td className="action-cell">
                      <Link to={`/app/courses/${course._id || course.id}`} className="link-button ghost-button">
                        View
                      </Link>
                      <RoleGate allow={['admin', 'teacher']}>
                        <button type="button" disabled={loadingAction} onClick={() => openForm(course)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="danger-button"
                          disabled={loadingAction || user?.role === 'student'}
                          onClick={() => handleDelete(course._id || course.id)}
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

      {/* Basic Modal for Add/Edit */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100,
          display: 'grid', placeItems: 'center', padding: '1rem', animation: 'fadeUp 0.2s ease'
        }}>
          <div className="panel" style={{ width: 'min(400px, 100%)', background: 'var(--surface-2)', padding: '2rem' }}>
            <h3>{editingId ? 'Edit Course' : 'Create Course'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
              <label style={{ display: 'grid', gap: '0.5rem', fontWeight: 500 }}>
                Course Title
                <input 
                  type="text" 
                  autoFocus
                  required
                  placeholder="E.g., Intro to Advanced React" 
                  value={formData.title} 
                  onChange={e => setFormData({ title: e.target.value })} 
                />
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="ghost-button" onClick={closeForm}>Cancel</button>
                <button type="submit" className="primary-button" disabled={loadingAction}>
                  {loadingAction ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
