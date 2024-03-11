import tgmuLogo from '@/assets/tgmu-logo.svg';
import NavbarUserProfile from './navbar-user-profile';
import { useAuth } from '@/helpers/auth.context';
import { useNavigate } from '@tanstack/react-router';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate({ to: '/profile' });
  };

  return (
    <div className="d-flex flex-column h-100 w-100 align-items-center">
      <img src={tgmuLogo} alt="tgmu-logo" style={{ width: '10em' }} />
      <div style={{ marginTop: 'auto', cursor: 'pointer' }} className="w-100" onClick={handleProfileClick}>
        <NavbarUserProfile
          imgUrl={user?.imgUrl}
          subtitle={user!.email}
          title={`${user!.firstName} ${user!.lastName}`}
        />
      </div>
    </div>
  );
};

export default Navbar;
