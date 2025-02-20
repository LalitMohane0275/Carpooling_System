import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationCode, setVerificationCode] = useState('');
  const email = new URLSearchParams(location.search).get('email');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:3000/api/v1/auth/verify-email',
        { email, verificationCode }
      );
      toast.success('Email verified successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      toast.error('Invalid or expired verification code');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="mb-10">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We sent a verification code to your email: <b>{email}</b>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="verification-code" className="sr-only">
                Verification Code
              </label>
              <input
                id="verification-code"
                name="verification-code"
                type="text"
                autoComplete="current-verification-code"
                required
                className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Verify Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerifyEmailPage;