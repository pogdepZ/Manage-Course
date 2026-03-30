import { useNavigate } from 'react-router-dom';
import { useAuth } from '../stores/authStore';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <h2>Profile</h2>
          <p>Account and session controls.</p>
        </div>
      </header>

      <section className="panel profile-grid">
        <div>
          <p>Name</p>
          <strong>{user?.name || '-'}</strong>
        </div>
        <div>
          <p>Email</p>
          <strong>{user?.email || '-'}</strong>
        </div>
        <div>
          <p>Role</p>
          <strong>{user?.role || '-'}</strong>
        </div>
        <div>
          <p>Department</p>
          <strong>{user?.department || '-'}</strong>
        </div>
      </section>

      <button type="button" className="danger-button" onClick={handleLogout}>
        Logout
      </button>
    </section>
  );
}
