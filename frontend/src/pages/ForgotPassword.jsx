import Header from '../components/Header';
import { useUser } from "@clerk/clerk-react";
import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useClerk } from '@clerk/clerk-react';

const ForgotPassword = () => {
  const { isSignedIn, isLoaded } = useUser();
  const { client } = useClerk();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Redirect if already signed in
  if (isLoaded && isSignedIn) {
    return <Navigate to="/" replace />;
  }

  // Show loading if Clerk is still loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen w-full flex flex-col">
        <Header />
        <div className="flex flex-1 h-full w-full justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      await client.signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });
      setMessage('Password reset instructions have been sent to your email address.');
    } catch (err) {
      setError(err.errors?.[0]?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header />
      <div className="flex flex-1 h-full w-full">
        {/* Left side full image */}
        <div className="hidden md:block w-1/2 h-full relative">
          <img src={import.meta.env.BASE_URL + 'src/assets/images/login.jpg'} alt="Reset Password Visual" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="text-white text-center p-8">
              <h3 className="text-4xl font-bold mb-4">Forgot Your Password?</h3>
              <p className="text-xl">Don't worry, we'll help you reset it</p>
            </div>
          </div>
        </div>
        {/* Right side full content */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white/90 px-8 py-12">
          <div className="w-full max-w-md">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2 tracking-tight text-center">Reset Password</h2>
            <p className="text-gray-500 mb-8 text-center">Enter your email address and we'll send you instructions to reset your password.</p>
            
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {message && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-600 text-sm">{message}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-700 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 rounded-full transition-all duration-200"
              >
                {isLoading ? 'Sending...' : 'Send Reset Instructions'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;