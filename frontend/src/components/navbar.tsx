import tgmuLogo from '@/assets/tgmu-logo.svg';
import NavbarUserProfile from './navbar-user-profile';
import { useAuth } from '@/helpers/auth.context';
import { Link } from '@tanstack/react-router';
import './navbar.scss';
import { FaMagnifyingGlass, FaTicket } from 'react-icons/fa6';
import { IconType } from 'react-icons/lib';

interface NavbarRoute {
  name: string;
  path: string;
  icon: IconType;
}

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const routes: NavbarRoute[] = [
    { name: 'Discover', path: '/', icon: FaMagnifyingGlass },
    { name: 'Experiences', path: '/experiences', icon: FaTicket },
  ];

  return (
    <div className="d-flex flex-column h-100 w-100 align-items-center tgmu-navbar">
      <Link to="/">
        <img src={tgmuLogo} alt="tgmu-logo" style={{ width: '10em', marginTop: '6rem' }} />
      </Link>
      <div className="mt-4 d-flex flex-column gap-3">
        {routes.map((route) => (
          <Link to={route.path} key={route.path}>
            {({ isActive }) => {
              return (
                <div className={`d-flex align-items-center gap-3 py-2 px-4 ${isActive ? 'active' : ''}`}>
                  {route.icon({ size: '1em' })}
                  <div style={{ fontWeight: '500', fontSize: '1.1em' }}>{route.name}</div>
                </div>
              );
            }}
          </Link>
        ))}
      </div>
      <div style={{ marginTop: 'auto', marginBottom: '1rem' }} className="w-100">
        <Link to="/profile">
          <NavbarUserProfile
            imgUrl={user?.imgUrl}
            subtitle={user!.email}
            title={`${user!.firstName} ${user!.lastName}`}
          />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
