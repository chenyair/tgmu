import { useAuth } from '@/helpers/auth.context';
import { authenticationService } from '@/services/auth-service';
import { writeTokens } from '@/utils/local-storage';
import { useForm } from '@tanstack/react-form';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import React from 'react';
import { flushSync } from 'react-dom';
import { IUserDetails } from 'shared-types';
import AuthFormInput from '../components/auth-form-input';

const RegisterPage: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const registerForm = useForm({
    defaultValues: {
      email: '',
      password: '',
      retypePassword: '',
      birthdate: new Date(),
      firstName: '',
      lastName: '',
      imgUrl: '',
    },
    onSubmit: async ({ value }) => {
      const { email, password, birthdate, firstName, lastName, imgUrl } = value;
      const tokens = await authenticationService.register({ firstName, lastName, email, password, birthdate, imgUrl });
      writeTokens(tokens, false);

      flushSync(() => {
        const payload = jwtDecode<JwtPayload & IUserDetails>(tokens.accessToken, {});
        auth.setUser(payload);
      });

      navigate({ to: '/' });
    },
  });

  const openLoginPage = () => {
    navigate({ to: '/login', search: { redirect: '/' } });
  };

  return (
    <registerForm.Provider>
      <form
        className="d-flex gap-1 h-100 justify-content-center flex-column flex-wrap"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void registerForm.handleSubmit();
        }}
      >
        <registerForm.Field
          name="email"
          children={(field) => (
            <AuthFormInput
              title="Email Adress"
              type="text"
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
        <registerForm.Field
          name="password"
          children={(field) => (
            <AuthFormInput
              title="Password"
              type="password"
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
        <registerForm.Field
          name="retypePassword"
          children={(field) => (
            <AuthFormInput
              title="Retype Password"
              type="password"
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
        <registerForm.Field
          name="firstName"
          children={(field) => (
            <AuthFormInput
              title="First Name"
              type="text"
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
        <registerForm.Field
          name="lastName"
          children={(field) => (
            <AuthFormInput
              title="Last Name"
              type="text"
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
        <registerForm.Field
          name="birthdate"
          children={(field) => (
            <AuthFormInput
              title="Birthdate"
              type="date"
              name={field.name}
              value={field.state.value}
              onChange={(date) => field.handleChange(date)}
            />
          )}
        />
        <div className="mt-3">
          <button type="submit" className="btn btn-success w-100">
            Register now
          </button>
          <div>
            <span className="no-account-text">Already have an account? </span>
            <span className="no-account-text create-new-account-text" onClick={openLoginPage}>
              Click here to login!
            </span>
          </div>
        </div>
      </form>
    </registerForm.Provider>
  );
};

export default RegisterPage;
