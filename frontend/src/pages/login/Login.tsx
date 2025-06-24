import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';

import Button from '@/components/ui/button/Button';
import Input from '@/components/ui/input/Input';
import { Form, FormGroup, FormFooter, FormMessage } from '@/components/ui/form/Form';
import styles from './Login.module.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
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
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      await login(formData.username, formData.password);
      navigate('/');
    } catch {
      setErrors({
        general: 'Invalid username or password',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Enter your credentials to access your account</p>
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

          <FormMessage type="error">{errors.general}</FormMessage>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isLoading}
            style={{ marginTop: '8px' }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Form>

        <FormFooter>
          <p className={styles.footerText}>
            Don't have an account?{' '}
            <Link to="/register" className={styles.link}>
              Sign up
            </Link>
          </p>
        </FormFooter>
      </div>
    </div>
  );
};

export default Login;
