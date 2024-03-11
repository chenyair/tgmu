import { useAuth } from '@/helpers/auth.context';
import { usersService } from '@/services/user-service';
import { useForm } from '@tanstack/react-form';
import FormInput from '@/components/form-input';
import './index.scss';
import { flushSync } from 'react-dom';
import { clearTokens } from '@/utils/local-storage';
import { useNavigate } from '@tanstack/react-router';
import { IUserUpdatePayload } from 'shared-types';

const Divider: React.FC = () => {
  return (
    <div className="d-flex align-items-center pb-3 pt-3">
      <div style={{ borderBottom: '0.1rem solid rgb(60,60,60)', width: '100%' }} />
    </div>
  );
};

const ProfilePage: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const user = auth.user!;

  const userDetailsForm = useForm<IUserUpdatePayload>({
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
      const updatedUser = await usersService.updateById(user._id!, value);

      flushSync(() => {
        auth.setUser(updatedUser);
      });
    },
  });

  const logout = () => {
    clearTokens();
    navigate({ to: '/login', search: { redirect: '/' } });
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
          <div className="d-flex">
            <div>
              <button type="submit" className="btn btn-success w-10">
                Update profile
              </button>
            </div>
            <div style={{ paddingLeft: '1.5rem' }}>
              <button className="btn btn-danger w-10" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </form>
      </userDetailsForm.Provider>
    </div>
  );
};

export default ProfilePage;
