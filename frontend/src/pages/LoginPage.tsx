import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Layout from '../components/Layout';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '@radix-ui/react-label';

const LoginPage: React.FC = () => {
  const { login, register, isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
  const [isRegisterSubmitting, setIsRegisterSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      if (user?.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoginSubmitting(true);
    try {
      await login(loginEmail, loginPassword);
      // Redirection handled by useEffect
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoginSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsRegisterSubmitting(true);
    try {
      await register(registerEmail, registerPassword);
      // Redirection handled by useEffect
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsRegisterSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-center text-3xl md:text-5xl font-bold text-gray-800 mb-12">
            Welcome to <span className="text-[#d4a843]">Yeti - The Himalayan Kitchen</span>
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 max-w-md mx-auto" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Login Section */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Embark on Your Culinary Journey</h2>
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d4a843] focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d4a843] focus:border-transparent transition-all duration-200"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#d4a843] hover:bg-[#b88e3a] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
                  disabled={isLoginSubmitting}
                >
                  {isLoginSubmitting ? 'Logging in...' : 'Login to Your Account'}
                </Button>
              </form>
            </div>

            {/* Registration Section */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Join the Himalayan Family</h2>
              <form onSubmit={handleRegisterSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-2">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d4a843] focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-2">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d4a843] focus:border-transparent transition-all duration-200"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#d4a843] hover:bg-[#b88e3a] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
                  disabled={isRegisterSubmitting}
                >
                  {isRegisterSubmitting ? 'Registering...' : 'Create New Account'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LoginPage;