import React from 'react';
import loginBackground from '../../assets/login-background.jpg';
import './index.scss';
import LoginForm from './components/login-form';

const LoginPage: React.FC = () => {
  return (
    <div className="row h-100">
      <div className="col-3 login-section p-5">
        <LoginForm />
      </div>
      <img className="col-9 p-0 h-100" src={loginBackground} />
    </div>
  );
};

export default LoginPage;
