import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { http } from '../api/http';
import RoleGate from '../components/RoleGate';
import { extractErrorMessage, formatDate } from '../utils/helpers';
import { useToast } from '../stores/toastStore';

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const toast = useToast();
  
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [courseLessons, setCourseLessons] = useState([]);
  const [requestError, setRequestError] = useState('');
  
  const [teacherEmail, setTeacherEmail] = useState('');
  const [addingTeacher, setAddingTeacher] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setRequestError('');
    try {
      const courseResponse = await http.get(`/courses/${courseId}`);
      const nextCourse = courseResponse.data?.data || courseResponse.data;
      setCourse(nextCourse);

      const lessonsResponse = await http.get('/lessons');
      const lessons = lessonsResponse.data?.data || lessonsResponse.data || [];
      const filteredLessons = lessons.filter(
        (lesson) => String(lesson.courseId) === String(nextCourse?._id || nextCourse?.id)
      );
      setCourseLessons(filteredLessons);
    } catch (error) {
      const status = error?.response?.status;
      if (status === 403) setRequestError('Not authorized to view course details.');
      else if (status === 404) setRequestError('Course not found.');
      else setRequestError(extractErrorMessage(error, 'Failed to load data.'));
      setCourse(null);
      setCourseLessons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [courseId]);

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    if (!teacherEmail.trim()) return;
    setAddingTeacher(true);
    try {
      await http.post(`/courses/${courseId}/teachers`, { email: teacherEmail });
      toast.success('Teacher added successfully!');
      setTeacherEmail('');
      loadData(); // refresh data to show new teacher
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add teacher');
    } finally {
      setAddingTeacher(false);
    }
  };

  if (loading) {
    return (
      <section className="page-stack">
        <header className="page-header">
          <div>
            <h2>Course Detail</h2>
            <p>Loading...</p>
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
            <p>Access check failed.</p>
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
          <p>Metadata, lessons and teacher management.</p>
        </div>
        <RoleGate allow={['admin', 'teacher']}>
          <div className="inline-actions">
            {/* Action buttons removed per user request */}
          </div>
        </RoleGate>
      </header>

      <section className="panel metadata-grid">
        <div>
          <p>Owner</p>
          <strong>{course?.owner || course?.createdBy?.name || course?.createdBy || '-'}</strong>
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
            <button type="button" className="primary-button" onClick={() => window.location.href = '/app/lessons'}>
              + Manage Lessons
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

      <RoleGate allow={['admin', 'teacher']}>
        <section className="panel">
          <div className="panel-header">
            <h3>Co-Teachers</h3>
          </div>
          <div className="list-stack">
            {course?.teachers?.length > 0 ? (
              <ul>
                {course.teachers.map((t, idx) => (
                  <li key={idx}>Teacher: {t.name || t}</li>
                ))}
              </ul>
            ) : (
              <p className="empty-state" style={{ padding: '1rem' }}>No co-teachers assigned yet.</p>
            )}
            
            <form className="inline-form" onSubmit={handleAddTeacher} style={{ marginTop: '1rem' }}>
              <input 
                type="email" 
                placeholder="Enter teacher email" 
                value={teacherEmail} 
                onChange={(e) => setTeacherEmail(e.target.value)} 
                required 
              />
              <button type="submit" className="primary-button" disabled={addingTeacher}>
                {addingTeacher ? 'Adding...' : 'Add Teacher'}
              </button>
            </form>
          </div>
        </section>
      </RoleGate>
    </section>
  );
}
