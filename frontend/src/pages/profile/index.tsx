import { useAuth } from '@/helpers/auth.context';
import { usersService } from '@/services/user-service';
import { useForm } from '@tanstack/react-form';
import { TailSpin as Loader } from 'react-loader-spinner';
import FormInput from '@/components/form-input';
import './index.scss';
import { flushSync } from 'react-dom';
import { clearTokens, writeTokens } from '@/utils/local-storage';
import { useNavigate } from '@tanstack/react-router';
import { IUserDetails } from 'shared-types';
import { useState } from 'react';
import { authenticationService } from '@/services/auth-service';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { isEmpty } from 'validator';
import Divider from '@/components/divider';

export interface IUserFormInputProps extends Omit<IUserDetails, '_id'> {
  image: {
    file: File | null;
    currImgUrl: string | undefined;
  };
  changePassword: {
    currentPassword: string;
    newPassword: string;
  };
}

const ProfilePage: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updateStatus, setUpdatedStatus] = useState<boolean | undefined>(undefined);

  const user = auth.user!;

  const userDetailsForm = useForm<IUserFormInputProps>({
    defaultValues: {
      ...user,
      image: {
        file: null,
        currImgUrl: user.imgUrl,
      },
      changePassword: {
        currentPassword: '',
        newPassword: '',
      },
    },

    onSubmit: async ({ value }) => {
      try {
        setUpdatedStatus(undefined);
        setIsLoading(true);
        await usersService.updateById(user._id!, value);
        const refreshToken = sessionStorage.getItem('refreshToken')!;
        const tokens = await authenticationService.refreshAccessToken(refreshToken);
        setUpdatedStatus(true);

        // Check if theres a refresh token in local storage which means the user wants to be remembered
        const remember = !!localStorage.getItem('refreshToken');
        writeTokens(tokens, remember);

        flushSync(() => {
          const payload = jwtDecode<JwtPayload & IUserDetails>(tokens.accessToken);
          auth.setUser(payload);
        });
      } catch (err) {
        setUpdatedStatus(false);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    validators: {
      onSubmit({ value }) {
        if (!validateName(value.firstName) || !validateName(value.lastName)) return 'invalid values';
      },
    },
  });

  const logout = () => {
    const refreshToken = sessionStorage.getItem('refreshToken')!;
    authenticationService.logout(refreshToken);
    clearTokens();
    navigate({ to: '/login', search: { redirect: '/' } });
  };

  const validateName = (name: string) => {
    const valid = !isEmpty(name) && /^[a-zA-Z]+$/.test(name);
    return valid;
  };

  return (
    <div className="d-flex h-100 text-light flex-column w-80 p-5">
      <div className="d-flex flex-row w-100" style={{ height: '12%' }}>
        <div className="display-6 fw-semibold">Settings</div>
      </div>
      <div className="d-flex flex-row w-100">
        <div className="d-flex flex-column ">
          <div className="fs-4 fw-semibold">Profile</div>
          <div style={{ fontSize: '1rem' }}>Update your photo and personal details here.</div>
        </div>
      </div>
      <Divider />
      <userDetailsForm.Provider>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void userDetailsForm.handleSubmit();
          }}
          className="d-flex gap-1 h-80 flex-column edit-user-form"
        >
          <userDetailsForm.Field
            name="email"
            children={(field) => (
              <FormInput
                title="Email Address"
                type="text"
                description="Your email address cannot be changed"
                inline={true}
                name={field.name}
                disabled={true}
                value={field.state.value!}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          />
          <Divider />
          <userDetailsForm.Field
            name="firstName"
            children={(field) => (
              <FormInput
                title="First Name"
                type="text"
                validate={validateName}
                name={field.name}
                inline={true}
                value={field.state.value!}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          />
          <Divider />
          <userDetailsForm.Field
            name="lastName"
            children={(field) => (
              <FormInput
                title="Last Name"
                type="text"
                name={field.name}
                validate={validateName}
                inline={true}
                value={field.state.value!}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          />
          <Divider />
          <userDetailsForm.Field
            name="image"
            children={(field) => (
              <FormInput
                title="Image"
                type="image"
                inline={true}
                name={field.name}
                value={field.state.value}
                description="Your profile photo"
                onChange={(e) => field.handleChange({ ...field.state.value, file: e.target.files?.[0] || null })}
              />
            )}
          />
          <Divider />
          <userDetailsForm.Field
            name="birthdate"
            children={(field) => (
              <FormInput
                title="Birthdate"
                type="date"
                inline={true}
                name={field.name}
                value={field.state.value!}
                onChange={(date) => field.handleChange(date)}
              />
            )}
          />
          <Divider />
          <userDetailsForm.Field
            name="changePassword"
            children={(field) => (
              <div className="d-flex">
                <label className="flex-column fw-bold tgmu-form-label" style={{ width: `${100 / 3}%` }}>
                  Change password
                </label>
                <FormInput
                  title="Enter Current Password"
                  type="password"
                  name={field.name}
                  inline={true}
                  value={field.state.value!.currentPassword}
                  onChange={(e) => field.handleChange({ ...field.state.value!, currentPassword: e.target.value })}
                />
                <div style={{ paddingRight: '5%' }}></div>
                <FormInput
                  title="Enter New Password"
                  type="password"
                  name={field.name}
                  inline={true}
                  value={field.state.value!.newPassword}
                  onChange={(e) => field.handleChange({ ...field.state.value!, newPassword: e.target.value })}
                />
              </div>
            )}
          />
          <Divider />
          <div className="d-flex align-items-center">
            <div style={{ width: '9em' }}>
              <button type="submit" className="btn btn-success w-100" style={{ maxHeight: '2.4rem' }}>
                {isLoading ? (
                  <div className="d-flex justify-content-center align-content-center">
                    <Loader color="#fffcf2" height="1.8rem" width="1.8rem" />
                  </div>
                ) : (
                  'Update profile'
                )}
              </button>
            </div>
            <div style={{ paddingLeft: '1.5rem' }}>
              <button className="btn btn-danger w-10" onClick={logout}>
                Logout
              </button>
            </div>
            <div style={{ paddingLeft: '2rem', alignSelf: 'center', paddingTop: '0.8em' }}>
              {(() => {
                if (updateStatus === undefined) return '';
                if (updateStatus) return 'Profile Updated Successully';

                const isUpdatingPassword =
                  userDetailsForm.getFieldValue('changePassword.currentPassword') &&
                  userDetailsForm.getFieldValue('changePassword.newPassword');

                if (isUpdatingPassword) return 'Failed to update, Please validate the password you entered';

                return 'Failed To Update Profile, Please try again later';
              })()}
            </div>
          </div>
        </form>
      </userDetailsForm.Provider>
    </div>
  );
};

export default ProfilePage;
