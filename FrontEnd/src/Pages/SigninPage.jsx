import { useState } from 'react';

export default function SigninPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-white to-yellow-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-30 h-30 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full mb-4 shadow-lg">
            <img src="/src/Pages/images/Logo2.png" alt="Luna Gold" className="w-30 h-30 shadow-lg rounded-full" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">GoldVault</h1>
          <p className="text-gray-600">Welcome back to your investment journey</p>
        </div>

        {/* Sign In Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition outline-none"
                placeholder="your.email@example.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="#" className="text-xs text-amber-600 hover:text-amber-700 font-medium">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition outline-none pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <img src="/src/Pages/images/PassOff.png" className="hover:brightness-50 hover:contrast-50" alt="Hide password" />
                  ) : (
                    <img src="/src/Pages/images/PassOn.png" className="hover:brightness-50 hover:contrast-50" alt="Show password" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-300 to-yellow-600 text-white font-semibold py-3 rounded-lg hover:from-amber-500 hover:to-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-gray-500">Or continue with</span>
            </div>
          </div>
          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <a href="#" className="text-amber-600 hover:text-amber-700 font-semibold">
              Create Account
            </a>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Secure gold investment platform trusted by thousands
        </p>
      </div>
    </div>
  );
}