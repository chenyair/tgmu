import React from 'react';
import LoginFormInput from '../components/auth-form-input';
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

const LoginPage: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const routeApi = getRouteApi('/_auth/login');
  const search = routeApi.useSearch();

  const loginForm = useForm({
    defaultValues: { email: '', password: '', remember: false },
    onSubmit: async ({ value }) => {
      const { email, password, remember } = value;
      const tokens = await authenticationService.login(email, password);

      writeTokens(tokens, remember);

      flushSync(() => {
        const payload = jwtDecode<JwtPayload & IUserDetails>(tokens.accessToken, {});
        auth.setUser(payload);
      });

      navigate({ to: search.redirect });
    },
  });

  const openRegisterPage = () => {
    navigate({ to: '/register', search });
  };

  return (
    <loginForm.Provider>
      <form
        className="d-flex gap-3 h-100 justify-content-center flex-column flex-wrap"
        style={{ width: '85%' }}
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
        </div>
      </form>
    </loginForm.Provider>
  );
};

export default LoginPage;
