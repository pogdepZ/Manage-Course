import { useMemo, useState } from 'react';
import RoleGate from '../components/RoleGate';
import { lessonList } from '../utils/mockData';

export default function LessonsPage() {
  const [course, setCourse] = useState('all');
  const [keyword, setKeyword] = useState('');

  const courses = useMemo(() => ['all', ...new Set(lessonList.map((lesson) => lesson.courseTitle))], []);

  const filtered = useMemo(
    () =>
      lessonList.filter((lesson) => {
        const matchedCourse = course === 'all' || lesson.courseTitle === course;
        const matchedKeyword = lesson.preview.toLowerCase().includes(keyword.toLowerCase());
        return matchedCourse && matchedKeyword;
      }),
    [course, keyword]
  );

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <h2>Lessons</h2>
          <p>Filter by course and keyword, then manage lesson items.</p>
        </div>
        <RoleGate allow={['admin', 'teacher']}>
          <button type="button" className="primary-button">
            + New Lesson
          </button>
        </RoleGate>
      </header>

      <section className="panel">
        <div className="filter-row">
          <select value={course} onChange={(event) => setCourse(event.target.value)}>
            {courses.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <input
            type="search"
            placeholder="Keyword"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <button
            type="button"
            className="ghost-button"
            onClick={() => {
              setCourse('all');
              setKeyword('');
            }}
          >
            Reset
          </button>
        </div>

        {filtered.length === 0 ? (
          <p className="empty-state">No lessons match current filters.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Preview Content</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lesson) => (
                  <tr key={lesson.id}>
                    <td>{lesson.courseTitle}</td>
                    <td>{lesson.preview}</td>
                    <td className="action-cell">
                      <button type="button">View</button>
                      <RoleGate allow={['admin', 'teacher']}>
                        <button type="button">Edit</button>
                        <button type="button">Delete</button>
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
