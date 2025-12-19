
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockAuth } from '../services/firebase';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useToast } from '../context/ToastContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await mockAuth.signInWithEmailAndPassword(email, password);
      addToast('Login successful!', 'success');
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      addToast(`Login failed: ${errorMessage}`, 'error');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/signup" className="font-medium text-primary hover:text-primary-dark">
              start your journey with InsureNaija
            </Link>
          </p>
          <p className="mt-4 text-center text-xs text-gray-500">
            Client: client@insurenaija.com / password123 <br/>
            Admin: admin@insurenaija.com / password123
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <Input
              label="Email address"
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="pt-4">
              <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Button type="submit" isLoading={isLoading} variant="primary">
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
