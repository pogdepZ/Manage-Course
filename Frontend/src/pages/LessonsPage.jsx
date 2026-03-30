import { useEffect, useMemo, useState } from 'react';
import { http } from '../api/http';
import RoleGate from '../components/RoleGate';
import { useAuth } from '../stores/authStore';
import { useToast } from '../stores/toastStore';

export default function LessonsPage() {
  const { user } = useAuth();
  const toast = useToast();
  
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  
  const [courseFilter, setCourseFilter] = useState('all');
  const [keyword, setKeyword] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ courseId: '', content: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [lessonRes, courseRes] = await Promise.all([
        http.get('/lessons'),
        http.get('/courses')
      ]);
      setLessons(lessonRes.data?.data || lessonRes.data || []);
      setCourses(courseRes.data?.data || courseRes.data || []);
    } catch (error) {
      toast.error('Failed to load lessons data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return lessons.filter(lesson => {
      const matchedCourse = courseFilter === 'all' || lesson.courseId === courseFilter;
      const matchedKeyword = (lesson.content || '').toLowerCase().includes(keyword.toLowerCase());
      return matchedCourse && matchedKeyword;
    });
  }, [lessons, courseFilter, keyword]);

  const openForm = (lesson = null) => {
    setIsModalOpen(true);
    if (lesson) {
      setEditingId(lesson._id || lesson.id);
      setFormData({ courseId: lesson.courseId, content: lesson.content });
    } else {
      setEditingId(null);
      setFormData({ courseId: courses[0]?._id || '', content: '' });
    }
  };

  const closeForm = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ courseId: '', content: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.courseId || !formData.content.trim()) return toast.error('Check required fields');
    
    setLoadingAction(true);
    try {
      if (editingId) {
        await http.patch(`/lessons/${editingId}`, formData);
        toast.success('Lesson updated successfully');
      } else {
        await http.post('/lessons', formData);
        toast.success('Lesson created successfully');
      }
      closeForm();
      fetchData();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Action failed');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = async (lessonId) => {
    if (!window.confirm('Delete this lesson?')) return;
    setLoadingAction(true);
    try {
      await http.delete(`/lessons/${lessonId}`);
      toast.success('Lesson deleted!');
      fetchData();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Delete failed');
    } finally {
      setLoadingAction(false);
    }
  };

  const getCourseTitle = (cId) => courses.find(c => (c._id || c.id) === cId)?.title || cId;

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <h2>Lessons Management</h2>
          <p>Filter by course, view contents, and manage lesson structure.</p>
        </div>
        <RoleGate allow={['admin', 'teacher']}>
          <button type="button" className="primary-button" onClick={() => openForm(null)}>
            + New Lesson
          </button>
        </RoleGate>
      </header>

      <section className="panel">
        <div className="filter-row">
          <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
            <option value="all">All Courses</option>
            {courses.map(c => (
              <option key={c._id || c.id} value={c._id || c.id}>{c.title}</option>
            ))}
          </select>
          <input
            type="search"
            placeholder="Search content..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="button" className="ghost-button" onClick={() => { setCourseFilter('all'); setKeyword(''); }}>
            Reset
          </button>
        </div>

        {loading ? (
          <p className="empty-state">Loading lessons...</p>
        ) : filtered.length === 0 ? (
          <p className="empty-state">No lessons match currently applied filters.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Lesson Content (Preview)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lesson) => (
                  <tr key={lesson._id || lesson.id}>
                    <td><strong>{getCourseTitle(lesson.courseId)}</strong></td>
                    <td style={{ color: 'var(--muted)' }}>
                      {lesson.content.length > 50 ? lesson.content.substring(0, 50) + '...' : lesson.content}
                    </td>
                    <td className="action-cell">
                      <RoleGate allow={['admin', 'teacher']}>
                        <button type="button" onClick={() => openForm(lesson)} disabled={loadingAction}>
                          Edit
                        </button>
                        <button type="button" className="danger-button" onClick={() => handleDelete(lesson._id || lesson.id)} disabled={loadingAction}>
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

      {/* Basic Modal for Add/Edit Lesson */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100,
          display: 'grid', placeItems: 'center', padding: '1rem', animation: 'fadeUp 0.2s ease'
        }}>
          <div className="panel" style={{ width: 'min(500px, 100%)', background: 'var(--surface-2)', padding: '2rem' }}>
            <h3>{editingId ? 'Edit Lesson' : 'Create Lesson'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem', marginTop: '1.25rem' }}>
              
              <label style={{ display: 'grid', gap: '0.5rem', fontWeight: 500 }}>
                Target Course
                <select 
                  required 
                  value={formData.courseId} 
                  onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                >
                  <option value="" disabled>-- Select a course --</option>
                  {courses.map(c => (
                    <option key={c._id || c.id} value={c._id || c.id}>{c.title}</option>
                  ))}
                </select>
              </label>

              <label style={{ display: 'grid', gap: '0.5rem', fontWeight: 500 }}>
                Lesson Content
                <textarea 
                  required
                  placeholder="Enter lesson details, notes, or links..." 
                  value={formData.content} 
                  onChange={e => setFormData({ ...formData, content: e.target.value })} 
                  style={{ width: '100%', minHeight: '120px', padding: '1rem', border: '1px solid var(--line)', borderRadius: '12px', resize: 'vertical', fontFamily: 'inherit' }}
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
