import { useState } from 'react';
import '../App.css'
export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [clientError, setClientError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password === formData.confirmPassword) {
      setClientError('');
      console.log("Form submitted:", formData);
    } else {
      setClientError('Password mismatch');
    }
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
          <p className="text-gray-600">Start your digital gold investment journey</p>
        </div>

        {/* Signup Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                User Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition outline-none"
                placeholder="Enter your  name"
                required
              />
            </div>

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

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition outline-none"
                placeholder="+91 000 000 0000"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition outline-none pr-12"
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 "
                >
                  {showPassword ? (
                    <img src="/src/Pages/images/PassOff.png" className="hover:brightness-50  hover:contrast-50" />

                  ) : (
                    <img src="/src/Pages/images/PassOn.png" className="hover:brightness-50  hover:contrast-50" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition outline-none pr-12"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <img src="/src/Pages/images/PassOff.png" className="hover:brightness-50  hover:contrast-50" />

                  ) : (
                    <img src="/src/Pages/images/PassOn.png" className="hover:brightness-50  hover:contrast-50" />
                  )}
                </button>
                {clientError && (
                  <p className="text-red-500 text-sm mt-2">{clientError}</p>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="mt-1 w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                required
              />
              <label htmlFor="agreeToTerms" className="ml-3 text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-amber-600 hover:text-amber-700 font-medium">
                  Terms and Conditions
                </a>
                {' '}and{' '}
                <a href="#" className="text-amber-600 hover:text-amber-700 font-medium">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-300 to-yellow-600 text-white font-semibold py-3 rounded-lg hover:from-amber-500 hover:to-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Create Account
            </button>
          </form>


          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <a href="#" className="text-amber-600 hover:text-amber-700 font-semibold">
              Sign in
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