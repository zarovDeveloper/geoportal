import { useState, useEffect } from 'react';
import { useAuth } from '@/store/auth';
import { updateUser, changePassword } from '@/services/api';

import Button from '@/components/ui/button/Button';
import Input from '@/components/ui/input/Input';
import { Form, FormGroup, FormRow, FormActions, FormMessage } from '@/components/ui/form/Form';
import styles from './Profile.module.css';

interface ApiError {
  response?: {
    data?: {
      detail?: string;
    };
  };
}

const Profile = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
  });
  const [profileErrors, setProfileErrors] = useState<{ [key: string]: string }>({});

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<{ [key: string]: string }>({});

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username,
        email: user.email,
      });
    }
  }, [user]);

  const clearMessages = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (profileErrors[name]) {
      setProfileErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    clearMessages();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    clearMessages();
  };

  const validateProfileForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!profileData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (profileData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!profileData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setProfileErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateProfileForm() || !user) {
      return;
    }

    setIsLoading(true);
    clearMessages();

    try {
      const updatedUser = await updateUser(user.id, {
        username: profileData.username,
        email: profileData.email,
      });
      setUser(updatedUser);
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as ApiError).response?.data?.detail || 'Failed to update profile'
          : 'Failed to update profile';
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm() || !user) {
      return;
    }

    setIsLoading(true);
    clearMessages();

    try {
      await changePassword(user.id, passwordData.newPassword);
      setSuccessMessage('Password changed successfully!');
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as ApiError).response?.data?.detail || 'Failed to change password'
          : 'Failed to change password';
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Profile</h1>
          <p className={styles.subtitle}>Manage your account information and settings</p>
        </div>

        <div className={styles.sections}>
          {/* Profile Information Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Profile Information</h2>
              <p className={styles.sectionDescription}>Update your personal information</p>
            </div>

            {!isEditing ? (
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Username</span>
                  <span className={styles.infoValue}>{user.username}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Email</span>
                  <span className={styles.infoValue}>{user.email}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Roles</span>
                  <div className={styles.rolesList}>
                    {user.roles.map((role) => (
                      <span key={role.id} className={styles.roleBadge}>
                        {role.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Account Status</span>
                  <span className={styles.infoValue}>{user.is_active ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            ) : (
              <Form onSubmit={handleProfileSubmit}>
                <FormMessage type="success">{successMessage}</FormMessage>
                <FormMessage type="error">{errorMessage}</FormMessage>

                <FormRow>
                  <FormGroup>
                    <Input
                      label="Username"
                      type="text"
                      name="username"
                      value={profileData.username}
                      onChange={handleProfileChange}
                      error={profileErrors.username}
                      disabled={isLoading}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Input
                      label="Email"
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      error={profileErrors.email}
                      disabled={isLoading}
                    />
                  </FormGroup>
                </FormRow>

                <FormActions>
                  <Button type="submit" variant="primary" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setIsEditing(false);
                      setProfileData({
                        username: user.username,
                        email: user.email,
                      });
                      setProfileErrors({});
                      clearMessages();
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </FormActions>
              </Form>
            )}

            {!isEditing && (
              <Button
                variant="secondary"
                onClick={() => setIsEditing(true)}
                style={{ marginTop: '20px' }}
              >
                Edit Profile
              </Button>
            )}
          </div>

          {/* Password Change Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Change Password</h2>
              <p className={styles.sectionDescription}>
                Update your password to keep your account secure
              </p>
            </div>

            {!isChangingPassword ? (
              <Button variant="secondary" onClick={() => setIsChangingPassword(true)}>
                Change Password
              </Button>
            ) : (
              <Form onSubmit={handlePasswordSubmit}>
                <FormMessage type="success">{successMessage}</FormMessage>
                <FormMessage type="error">{errorMessage}</FormMessage>

                <FormGroup>
                  <Input
                    label="Current Password"
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter your current password"
                    error={passwordErrors.currentPassword}
                    disabled={isLoading}
                  />
                </FormGroup>

                <FormRow>
                  <FormGroup>
                    <Input
                      label="New Password"
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter your new password"
                      error={passwordErrors.newPassword}
                      disabled={isLoading}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Input
                      label="Confirm New Password"
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm your new password"
                      error={passwordErrors.confirmPassword}
                      disabled={isLoading}
                    />
                  </FormGroup>
                </FormRow>

                <FormActions>
                  <Button type="submit" variant="primary" disabled={isLoading}>
                    {isLoading ? 'Changing Password...' : 'Change Password'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      });
                      setPasswordErrors({});
                      clearMessages();
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </FormActions>
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
