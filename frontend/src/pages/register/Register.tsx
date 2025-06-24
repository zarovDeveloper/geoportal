import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '@/services/api';

import Button from '@/components/ui/button/Button';
import Input from '@/components/ui/input/Input';
import { Form, FormGroup, FormFooter, FormMessage } from '@/components/ui/form/Form';
import styles from './Register.module.css';

interface ApiError {
  response?: {
    data?: {
      detail?: string;
    };
  };
}

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await register(formData.username, formData.email, formData.password);

      navigate('/login');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as ApiError).response?.data?.detail || 'Registration failed. Please try again.'
          : 'Registration failed. Please try again.';
      setErrors({
        general: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create account</h1>
          <p className={styles.subtitle}>Enter your information to create your account</p>
        </div>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Input
              label="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              error={errors.username}
              disabled={isLoading}
            />
          </FormGroup>

          <FormGroup>
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              error={errors.email}
              disabled={isLoading}
            />
          </FormGroup>

          <FormGroup>
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              error={errors.password}
              disabled={isLoading}
            />
          </FormGroup>

          <FormGroup>
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              error={errors.confirmPassword}
              disabled={isLoading}
            />
          </FormGroup>

          <FormMessage type="error">{errors.general}</FormMessage>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isLoading}
            style={{ marginTop: '8px' }}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>
        </Form>

        <FormFooter>
          <p className={styles.footerText}>
            Already have an account?{' '}
            <Link to="/login" className={styles.link}>
              Sign in
            </Link>
          </p>
        </FormFooter>
      </div>
    </div>
  );
};

export default Register;
