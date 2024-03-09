import { useAuth } from '@/helpers/auth.context';
import { authenticationService } from '@/services/auth-service';
import { writeTokens } from '@/utils/local-storage';
import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
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
      remember: false,
      age: new Date(),
      firstName: '',
      lastName: '',
      imgUrl: '',
    },
    onSubmit: async ({ value }) => {
      const { email, password, age, firstName, lastName, imgUrl, remember } = value;
      const tokens = await authenticationService.register({ firstName, lastName, email, password, age: 18, imgUrl });
      writeTokens(tokens, remember);

      flushSync(() => {
        const payload = jwtDecode<JwtPayload & IUserDetails>(tokens.accessToken, {});
        auth.setUser(payload);
      });

      navigate({ to: '/' });
    },
  });

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
          name="age"
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
      </form>
    </registerForm.Provider>
  );
};

export default RegisterPage;
