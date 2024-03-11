import Navbar from '@/components/navbar';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import './_authenticated.scss';

const SiteLayout: React.FC = () => {
  return (
    <div className="row h-100">
      <div className="col-2 login-section p-3 navbar h-100">
        <Navbar />
      </div>
      <div className="col-10 p-0 h-100 application">
        <Outlet />
      </div>
    </div>
  );
};

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: SiteLayout,
});
