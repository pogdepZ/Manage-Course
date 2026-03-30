import { Outlet } from 'react-router-dom';
import { useAuth } from '../stores/authStore';
import BottomTabBar from './BottomTabBar';
import Sidebar from './Sidebar';
import ToastViewport from './ToastViewport';
import Topbar from './Topbar';

export default function AppLayout() {
  const { user } = useAuth();
  const role = user?.role || 'student';

  return (
    <div className="app-shell">
      <Sidebar role={role} />
      <div className="main-shell">
        <Topbar />
        <main className="content-shell">
          <Outlet />
        </main>
      </div>
      <BottomTabBar role={role} />
      <ToastViewport />
    </div>
  );
}
