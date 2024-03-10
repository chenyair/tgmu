import { Outlet, createFileRoute } from '@tanstack/react-router';
import loginBackground from '@/assets/login-background.jpg';
import './_auth.scss';

const AuthLayout: React.FC = () => {
  return (
    <div className="row h-100">
      <div className="col-3 login-section p-5">
        <Outlet />
      </div>
      <img className="col-9 p-0 h-100" src={loginBackground} />
    </div>
  );
};

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
});
