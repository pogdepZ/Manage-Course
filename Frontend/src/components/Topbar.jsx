import { useNavigate } from 'react-router-dom';
import { useAuth } from '../stores/authStore';

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div className="search-wrap">
        <input type="search" placeholder="Search courses, lessons..." />
      </div>
      <div className="topbar-actions">
        <button type="button" className="ghost-button" aria-label="Notifications">
          Notifications
        </button>
        <details className="profile-menu">
          <summary>{user?.name || 'Profile'}</summary>
          <div className="profile-menu-panel">
            <p>{user?.email || 'demo@lms.local'}</p>
            <p>Role: {user?.role || 'student'}</p>
            <button type="button" onClick={() => navigate('/app/profile')}>
              Profile
            </button>
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </details>
      </div>
    </header>
  );
}
