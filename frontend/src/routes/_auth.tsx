import { Outlet, createFileRoute } from '@tanstack/react-router';
import authBackground from '@/assets/new-auth-background.jpg';
import './_auth.scss';

const AuthLayout: React.FC = () => {
  return (
    <div className="row h-100">
      <div className="col-3 login-section p-5 h-100">
        <Outlet />
      </div>
      <div className="col-9 p-0 h-100 d-flex justify-content-center align-items-center auth-image">
        <img src={authBackground} style={{ width: '100%' }} />
      </div>
    </div>
  );
};

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
});
