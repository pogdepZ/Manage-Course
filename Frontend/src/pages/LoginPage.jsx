import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { loginRequest } from '../features/auth/authService';
import { useAuth } from '../stores/authStore';
import { useToast } from '../stores/toastStore';
import { extractErrorMessage } from '../utils/helpers';

function inferRoleFromEmail(email) {
  if (email.includes('admin')) {
    return 'admin';
  }
  if (email.includes('teacher')) {
    return 'teacher';
  }
  return 'student';
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/app/dashboard';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const payload = await loginRequest(form);
      const user = payload?.data?.user || payload?.user || {
        name: form.email.split('@')[0] || 'Demo User',
        email: form.email,
        role: inferRoleFromEmail(form.email),
        department: 'Computer Science',
      };
      const accessToken = payload?.data?.accessToken || payload?.accessToken || 'demo-access-token';
      const refreshToken = payload?.data?.refreshToken || payload?.refreshToken || 'demo-refresh-token';

      login(user, accessToken, refreshToken);
      toast.success('Login successful');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>LMS Portal</h1>
        <p>Welcome back. Please login to continue.</p>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
          />
        </label>

        <label>
          Password
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            placeholder="Enter password"
          />
        </label>

        <label className="checkbox-line">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(event) => setShowPassword(event.target.checked)}
          />
          Show password
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="auth-foot">
          Do not have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
