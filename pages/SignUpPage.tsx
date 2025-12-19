
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockAuth } from '../services/firebase';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useToast } from '../context/ToastContext';

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }
    setIsLoading(true);
    try {
      await mockAuth.createUserWithEmailAndPassword(email, password);
      addToast('Account created successfully!', 'success');
      // In a real app, you might send a verification email here.
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      addToast(`Sign up failed: ${errorMessage}`, 'error');
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
              Sign in
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
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
            <div className='pt-4'>
                <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className='pt-4'>
                <Input
                label="Confirm Password"
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
          </div>

          <div>
            <Button type="submit" isLoading={isLoading} variant="primary">
              Sign up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
