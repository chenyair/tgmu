import { useAuth } from '@/helpers/auth.context';
import { authenticationService } from '@/services/auth-service';
import { writeTokens } from '@/utils/local-storage';
import { useForm } from '@tanstack/react-form';
import { Puff as Loader } from 'react-loader-spinner';
import { useNavigate } from '@tanstack/react-router';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { IUserDetails } from 'shared-types';
import FormInput from '@/components/form-input';
import { isEmail, isEmpty } from 'validator';

const RegisterPage: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      try {
        setErrorOccurred(false);
        setIsLoading(true);
        const { email, password, birthdate, firstName, lastName, imgUrl } = value;
        const tokens = await authenticationService.register({
          firstName,
          lastName,
          email,
          password,
          birthdate,
          imgUrl,
        });
        writeTokens(tokens, false);

        flushSync(() => {
          const payload = jwtDecode<JwtPayload & IUserDetails>(tokens.accessToken, {});
          auth.setUser(payload);
        });

        navigate({ to: '/' });
      } catch {
        setErrorOccurred(true);
      } finally {
        setIsLoading(false);
      }
    },
    validators: {
      onSubmit({ value }) {
        // All fields are required besides imgUrl
        const requiredFields = Object.keys(value).filter((key) => key !== 'imgUrl') as Array<keyof typeof value>;
        if (
          !validateEmail(value.email) ||
          !validatePasswordsMatch(value.retypePassword) ||
          !validateName(value.firstName) ||
          !validateName(value.lastName) ||
          requiredFields.some((field) => isEmpty(value[field].toString()))
        )
          return 'Missing or invalid values';
      },
    },
  });

  const validateEmail = (email: string) => !isEmpty(email) && isEmail(email);

  const validatePasswordsMatch = (retypePassword: string) => {
    const password = registerForm.getFieldValue('password');
    if (retypePassword.length > 0) {
      return password === retypePassword;
    }
    return true;
  };

  const validateName = (name: string) => !isEmpty(name) && /^[a-zA-Z]+$/.test(name);

  const openLoginPage = () => {
    navigate({ to: '/login', search: { redirect: '/' } });
  };

  return (
    <registerForm.Provider>
      <form
        className="d-flex gap-1 h-100 justify-content-center flex-column flex-wrap"
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
              title="Email Address"
              validate={validateEmail}
              type="text"
              valid={!errorOccurred}
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
              valid={!errorOccurred}
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
              validate={validatePasswordsMatch}
              valid={!errorOccurred}
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
              validate={validateName}
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
              validate={validateName}
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
          <button type="submit" className="btn btn-success w-100" style={{ minHeight: '2.2rem' }}>
            {isLoading ? (
              <div className="d-flex justify-content-center">
                <Loader width="1.5rem" height="1.5rem"></Loader>
              </div>
            ) : (
              'Register now'
            )}
          </button>
          <div>
            <span className="no-account-text">Already have an account? </span>
            <span className="no-account-text create-new-account-text" onClick={openLoginPage}>
              Click here to login!
            </span>
          </div>
        </div>
        <div>
          <div style={{ position: 'absolute', bottom: '1em', left: '8em' }}></div>
          {errorOccurred && (
            <div className="alert alert-danger text-center" style={{ position: 'absolute' }}>
              <div>Invalid information</div>
              <div>Please try again with a different email</div>
            </div>
          )}
        </div>
      </form>
    </registerForm.Provider>
  );
};

export default RegisterPage;
