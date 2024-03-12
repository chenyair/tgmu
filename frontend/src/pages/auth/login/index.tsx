import React, { useState } from 'react';
import LoginFormInput from '@/components/form-input';
import './index.scss';
import GoogleSignInButton from '../components/google-sign-in-button';
import { useForm } from '@tanstack/react-form';
import { authenticationService } from '@/services/auth-service';
import { writeTokens } from '@/utils/local-storage';
import { useAuth } from '@/helpers/auth.context';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { flushSync } from 'react-dom';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { IUserDetails } from 'shared-types';
import { isEmail, isEmpty } from 'validator';

const LoginPage: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const routeApi = getRouteApi('/_auth/login');
  const search = routeApi.useSearch();
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);

  const loginForm = useForm({
    defaultValues: { email: '', password: '', remember: false },
    onSubmit: async ({ value }) => {
      try {
        const { email, password, remember } = value;
        const tokens = await authenticationService.login(email, password);

        writeTokens(tokens, remember);

        flushSync(() => {
          const payload = jwtDecode<JwtPayload & IUserDetails>(tokens.accessToken, {});
          auth.setUser(payload);
        });

        navigate({ to: search.redirect });
      } catch {
        setErrorOccurred(true);
      }
    },
    validators: {
      onSubmit({ value }) {
        const emailErr = isEmpty(value.email);
        const passwordErr = isEmpty(value.password);
        setEmailError(emailErr);
        setPasswordError(passwordErr);
        if (emailErr || passwordErr) return 'Email and password are required';
      },
    },
  });

  const validateEmail = () => {
    const email = loginForm.getFieldValue('email');
    if (!isEmpty(email) && !isEmail(email)) {
      setEmailError(true);
      return 'Invalid email';
    }
    setEmailError(false);
  };

  const openRegisterPage = () => {
    navigate({ to: '/register', search });
  };

  return (
    <loginForm.Provider>
      <form
        className="d-flex gap-3 h-100 justify-content-center flex-column flex-wrap"
        style={{ width: '85%' }}
        onBlur={(e) => {
          console.log(e);
          e.preventDefault();
          e.stopPropagation();
          void validateEmail();
        }}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void loginForm.handleSubmit();
        }}
      >
        <GoogleSignInButton />
        <div className="align-self-center fw-semibold">- OR -</div>
        <loginForm.Field
          name="email"
          children={(field) => (
            <LoginFormInput
              title="Email Adress"
              type="text"
              name={field.name}
              valid={!errorOccurred && !emailError}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
        <loginForm.Field
          name="password"
          children={(field) => (
            <LoginFormInput
              title="Password"
              type="password"
              name={field.name}
              valid={!errorOccurred && !passwordError}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
        <loginForm.Field
          name="remember"
          children={(field) => (
            <div className="form-check">
              <input
                className="form-check-input "
                type="checkbox"
                value={field.name}
                checked={field.state.value}
                id={field.name}
                name={field.name}
                onChange={(e) => field.handleChange(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="rememberMeCheck">
                Remember Me
              </label>
            </div>
          )}
        />
        <div>
          <button type="submit" className="btn btn-success w-100">
            Log In
          </button>
          <div>
            <span className="no-account-text">Don't have an account? </span>
            <span className="no-account-text create-new-account-text" onClick={openRegisterPage}>
              Create new one!
            </span>
          </div>
          {errorOccurred && (
            <div className="alert alert-danger" style={{ position: 'absolute', bottom: '3rem', left: '4rem' }}>
              Invalid email or password
            </div>
          )}
        </div>
      </form>
    </loginForm.Provider>
  );
};

export default LoginPage;
