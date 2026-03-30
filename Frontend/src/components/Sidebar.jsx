import { NavLink } from 'react-router-dom';

const menuByRole = {
  admin: [
    { to: '/app/dashboard', label: 'Dashboard' },
    { to: '/app/courses', label: 'Courses' },
    { to: '/app/lessons', label: 'Lessons' },
    { to: '/app/enrollments', label: 'Enrollments' },
    { to: '/app/permissions', label: 'Permissions' },
    { to: '/app/profile', label: 'Profile' },
  ],
  teacher: [
    { to: '/app/dashboard', label: 'Dashboard' },
    { to: '/app/courses', label: 'Courses' },
    { to: '/app/lessons', label: 'Lessons' },
    { to: '/app/enrollments', label: 'Enrollments' },
    { to: '/app/profile', label: 'Profile' },
  ],
  student: [
    { to: '/app/dashboard', label: 'Dashboard' },
    { to: '/app/courses', label: 'Courses' },
    { to: '/app/lessons', label: 'Lessons' },
    { to: '/app/enrollments', label: 'Enrollments' },
    { to: '/app/profile', label: 'Profile' },
  ],
};

export function getMenuByRole(role = 'student') {
  return menuByRole[role] || menuByRole.student;
}

export default function Sidebar({ role }) {
  const items = getMenuByRole(role);

  return (
    <aside className="sidebar desktop-only">
      <div className="brand-block">
        <p className="brand-kicker">LMS Portal</p>
        <h1>ManageCourse</h1>
      </div>
      <nav className="nav-list" aria-label="Main navigation">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
