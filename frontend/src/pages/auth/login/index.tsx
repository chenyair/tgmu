import React, { useState } from 'react';
import LoginFormInput from '@/components/form-input';
import './index.scss';
import { useForm } from '@tanstack/react-form';
import { Puff as Loader } from 'react-loader-spinner';
import { authenticationService } from '@/services/auth-service';
import { writeTokens } from '@/utils/local-storage';
import { GoogleLogin } from '@react-oauth/google';
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

  const [errorOccurred, setErrorOccurred] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loginForm = useForm({
    defaultValues: { email: '', password: '', remember: false },
    onSubmit: async ({ value }) => {
      try {
        setErrorOccurred(false);
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    },
    validators: {
      onSubmit({ value }) {
        const requiredFields = ['email', 'password'] as Array<keyof typeof value>;
        if (!validateEmail(value.email) || requiredFields.some((field) => isEmpty(value[field].toString())))
          return 'Missing or invalid values';
      },
    },
  });

  const validateEmail = (email: string) => !isEmpty(email) && isEmail(email);

  const handleGoogleSuccess = async (credential: string) => {
    const tokens = await authenticationService.googleSignIn(credential);
    writeTokens(tokens, loginForm.getFieldValue('remember'));

    flushSync(() => {
      const payload = jwtDecode<JwtPayload & IUserDetails>(tokens.accessToken, {});
      auth.setUser(payload);
    });

    navigate({ to: search.redirect });
  };

  const handleGoogleError = () => {
    console.error('google login failed');
    setErrorOccurred(true);
  };

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
        <div className="align-self-center">
          <GoogleLogin
            onSuccess={({ credential }) => handleGoogleSuccess(credential!)}
            onError={handleGoogleError}
            shape="circle"
            useOneTap={true}
          />
        </div>
        <div className="align-self-center fw-semibold">- OR -</div>
        <loginForm.Field
          name="email"
          children={(field) => (
            <LoginFormInput
              title="Email Address"
              type="text"
              name={field.name}
              valid={!errorOccurred}
              validate={validateEmail}
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
              valid={!errorOccurred}
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
          <div style={{ position: 'absolute', bottom: '3em', left: '8em' }}>
            <Loader visible={isLoading} width="6rem" height="6rem"></Loader>
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
