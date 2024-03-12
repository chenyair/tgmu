import React, { useEffect } from 'react';
import { useGoogleOAuth } from '@react-oauth/google';
declare global {
  interface Window {
    google: any;
  }
}
const GoogleSignInButton: React.FC = () => {
  const { clientId, scriptLoadedSuccessfully } = useGoogleOAuth();
  useEffect(() => {
    if (!scriptLoadedSuccessfully) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse,
    });
    window.google.accounts.id.renderButton(document.getElementById('google-signin-btn'), {
      shape: 'circle',
    });
  }, [scriptLoadedSuccessfully, clientId]);

  const handleCredentialResponse = (response: any) => {
    console.log('ID: ' + response.credential);
  };

  return (
    <div className="d-flex justify-content-center align-items-center btn-google-sign-in p-2">
      <button id="google-signin-btn"></button>
    </div>
  );
};

export default GoogleSignInButton;
