import { useAuth } from '../stores/authStore';

export default function RoleGate({ allow = [], children, fallback = null }) {
  const { user } = useAuth();

  if (!user || !allow.includes(user.role)) {
    return fallback;
  }

  return children;
}
