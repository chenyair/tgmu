import { Outlet, createFileRoute } from '@tanstack/react-router';
import authBackground from '@/assets/new-auth-background.jpg';
import tgmuLogo from '@/assets/tgmu-logo.svg';
import './_auth.scss';

const AuthLayout: React.FC = () => {
  return (
    <div className="row h-100">
      <div className="col-3 login-section p-2 h-100 d-flex flex-column justify-content-center">
        <div className="d-flex justify-content-center align-items-center flex-column gap-4">
          <img src={tgmuLogo} alt="logo-icon" style={{ width: '10em' }} />
          <Outlet />
        </div>
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
