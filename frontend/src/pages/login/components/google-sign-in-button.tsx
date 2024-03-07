import React from 'react';
import googleIcon from '../../../assets/google.svg';
import './google-sign-in-button.scss';

const GoogleSignInButton: React.FC = () => {
  return (
    <div className="d-flex justify-content-center align-items-center btn-google-sign-in p-2">
      <img alt="google-icon" className="google-icon me-2" src={googleIcon} />
      <span className="roboto-medium">Sign in with Google</span>
    </div>
  );
};

export default GoogleSignInButton;
