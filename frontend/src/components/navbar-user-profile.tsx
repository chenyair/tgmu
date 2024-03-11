import React from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import './navbar-user-profile.scss';

interface NavbarUserProfileProps {
  imgUrl?: string;
  title: string;
  subtitle: string;
}

const NavbarUserProfile: React.FC<NavbarUserProfileProps> = ({ imgUrl, title, subtitle }: NavbarUserProfileProps) => {
  return (
    <div className="d-flex align-items-center justify-content-center gap-2">
      <Avatar.Root className="AvatarRoot">
        <Avatar.Image
          className="AvatarImage"
          src={imgUrl || 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80'}
          alt="Colm Tuite"
        />
        <Avatar.Fallback className="AvatarFallback" delayMs={600}>
          CT
        </Avatar.Fallback>
      </Avatar.Root>
      <div className="d-flex flex-column">
        <div className="fs-6 fw-semibold">{title}</div>
        <div style={{ fontSize: '0.7em' }}>{subtitle}</div>
      </div>
    </div>
  );
};

export default NavbarUserProfile;
