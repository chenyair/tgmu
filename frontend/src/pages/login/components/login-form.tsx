import React from 'react';
import LoginFormInput from './login-form-input';
import GoogleSignInButton from '../../../assets/google-sign-in.svg';
import './login-form.scss';

const LoginForm: React.FC = () => {
  return (
    <div className="d-flex h-100 justify-content-center flex-column flex-wrap">
      <img alt="google-sign-in-btn" src={GoogleSignInButton} />
      <div className="align-self-center fw-semibold">- OR -</div>
      <LoginFormInput title="Email Adress" type="text" />
      <LoginFormInput title="Password" type="password" />
      <div className="form-check">
        <input className="form-check-input " type="checkbox" value="" id="rememberMeCheck" />
        <label className="form-check-label" htmlFor="rememberMeCheck">
          Remember Me
        </label>
      </div>
      <button type="button" className="btn btn-success w-100">
        Log In
      </button>
      <div>
        <span className="no-account-text">Don't have an account? </span>
        <span className="no-account-text create-new-account-text">Create new one!</span>
      </div>
    </div>
  );
};

export default LoginForm;
