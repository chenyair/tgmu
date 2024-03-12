import { useAuth } from '@/helpers/auth.context';
import { authenticationService } from '@/services/auth-service';
import { writeTokens } from '@/utils/local-storage';
import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { IUserDetails } from 'shared-types';
import FormInput from '@/components/form-input';
import { isEmpty } from 'validator';

const RegisterPage: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);

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
    validators: {
      onSubmit({ value }) {
        const email = isEmpty(value.email);
        const password = isEmpty(value.password);
        setEmailError(email);
        setPasswordError(password);
        if (email || password) return 'Email and password are required';
      },
    },
  });

  const openLoginPage = () => {
    navigate({ to: '/login', search: { redirect: '/' } });
  };

  const validateForm = () => {};

  return (
    <registerForm.Provider>
      <form
        className="d-flex gap-1 h-100 justify-content-center flex-column flex-wrap"
        onBlur={validateForm}
        style={{ width: '85%' }}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void registerForm.handleSubmit();
        }}
      >
        <registerForm.Field
          name="email"
          children={(field) => (
            <FormInput
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
            <FormInput
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
            <FormInput
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
            <FormInput
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
            <FormInput
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
            <FormInput
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
