import { NavLink } from 'react-router-dom';
import { getMenuByRole } from './Sidebar';

export default function BottomTabBar({ role }) {
  const items = getMenuByRole(role);

  return (
    <nav className="bottom-tabs mobile-only" aria-label="Mobile navigation">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `tab-link ${isActive ? 'active' : ''}`}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
