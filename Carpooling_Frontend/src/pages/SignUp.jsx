import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Car, Eye, EyeOff } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-right",
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/v1/signup", {
        email,
        password,
        confirmPassword,
      });

      if (response.status === 201) {
        toast.success("Sign up successful! Redirecting to home...", {
          position: "top-right",
        });
        navigate("/home");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center">
            <Car className="h-12 w-12 text-blue-600" strokeWidth={2} />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join RideBuddy and start your journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Email Field */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-blue-500" />
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
              <Lock className="h-4 w-4 text-blue-500" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
              <Lock className="h-4 w-4 text-blue-500" />
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Create Account
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              Log in
            </a>
          </p>
        </form>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="rounded-xl shadow-lg border border-blue-100"
      />
    </div>
  );
}

export default SignUpPage;
